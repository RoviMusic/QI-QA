"use server";
import { dolibarrPool, rmPool } from "@/lib/mysqldb";
import { queryOneRM, queryRM } from "@/lib/helpers/helperMysql";
import { ActionResult } from "next/dist/server/app-render/types";
import {
  CategoriesType,
  DepartmentFormData,
  LeafCategory,
} from "../types/departmentsType";
import { ResultSetHeader } from "mysql2";

export async function GetDepartments(): Promise<ActionResult> {
  try {
    const sql = `
    SELECT 
        d.id,
        d.short_name,
        d.long_name,
        d.color,
        COUNT(dcr.fk_categorie) as categoria_count,
        GROUP_CONCAT(dcr.fk_categorie) as categoria_ids
    FROM QI_cat_departments d
    LEFT JOIN QI_cat_departments_relationships dcr ON d.id = dcr.fk_department
    GROUP BY d.id, d.short_name, d.long_name;`;

    const deptos = await queryRM(sql);

    const allCategoriaIds = new Set();
    deptos.forEach((dept) => {
      if (dept.categoria_ids) {
        dept.categoria_ids
          .split(",")
          .forEach((id: any) => allCategoriaIds.add(id));
      }
    });

    let categorias: { [key: number]: string } = {};
    if (allCategoriaIds.size > 0) {
      const categoriasQuery = `
        SELECT rowid as id, label as name, fk_parent 
        FROM llx_categorie 
        WHERE rowid IN (${Array.from(allCategoriaIds).join(",")})
        ORDER BY id asc;
      `;
      const [categoriasResult] = (await dolibarrPool.query(
        categoriasQuery
      )) as [any[], any];

      // Crear objeto para fácil acceso
      categoriasResult.forEach((cat: { id: number; name: string }) => {
        categorias[cat.id] = cat.name;
      });
    }

    const resultado = deptos.map((dept) => ({
      id: dept.id,
      short_name: dept.short_name,
      long_name: dept.long_name,
      color: dept.color,
      categoria_count: dept.categoria_count,
      categories: dept.categoria_ids
        ? dept.categoria_ids.split(",").map((id: any) => ({
            id: parseInt(id),
            name: categorias[id],
          }))
        : [],
    }));
    return {
      success: true,
      data: resultado,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function GetAllCategories() {
  try {
    const sql = `select rowid as id, label as name, fk_parent, description from llx_categorie ORDER BY id asc;`;
    const [categories] = await dolibarrPool.query(sql);
    const jsonCategories = JSON.parse(JSON.stringify(categories));

    const categoryTree = await BuildCategoryTree(jsonCategories);

    return {
      success: true,
      data: jsonCategories,
      treeData: categoryTree,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function GetAllRelationships() {
  try {
    const sql = `select fk_department, fk_categorie from QI_cat_departments_relationships;`;
    const relationships = await queryRM(sql);
    const jsonRelationships = JSON.parse(JSON.stringify(relationships));

    return {
      success: true,
      data: jsonRelationships,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function GetDepartmentRelationships(departmentId: number) {
  try {
    const relationships = await rmPool.query(
      `select fk_department, fk_categorie from QI_cat_departments_relationships  WHERE fk_department = ?;`,
      [departmentId]
    );
    const jsonRelationships = JSON.parse(JSON.stringify(relationships));

    return {
      success: true,
      data: jsonRelationships,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function GetCategoryRelationships(categoryId: number) {
  try {
    const relationships = await queryRM(
      `SELECT d.id as departmentId, d.color 
      FROM QI_cat_departments d 
      LEFT JOIN QI_cat_departments_relationships dcr 
      ON d.id = dcr.fk_department 
      WHERE dcr.fk_categorie = ?;`,
      [categoryId]
    );
    const jsonRelationships = JSON.parse(JSON.stringify(relationships));

    return {
      success: true,
      data: jsonRelationships,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function BuildCategoryTree(
  categories: CategoriesType[]
): Promise<CategoriesType[]> {
  const categoryMap = new Map<number, CategoriesType>();
  const rootCategories: CategoriesType[] = [];

  // Primero, crear un mapa de todas las categorías e inicializar el array children
  categories.forEach((category) => {
    categoryMap.set(category.id, { ...category, children: [] });
  });

  // Segundo, construir la jerarquía
  categories.forEach((category) => {
    const categoryNode = categoryMap.get(category.id)!;

    if (category.fk_parent === null || category.fk_parent === 0) {
      // Es una categoría raíz
      rootCategories.push(categoryNode);
    } else {
      // Es una categoría hija, buscar su padre
      const parentCategory = categoryMap.get(category.fk_parent);
      if (parentCategory) {
        parentCategory.children!.push(categoryNode);
      } else {
        // Si no se encuentra el padre, tratarla como raíz
        rootCategories.push(categoryNode);
      }
    }
  });

  return rootCategories;
}

export async function GetLeafCategories(
  categories: CategoriesType[],
  currentPath: string[] = [],
  currentPathIds: number[] = []
): Promise<LeafCategory[]> {
  let leafs: LeafCategory[] = [];

  for (const category of categories) {
    const newPath = [...currentPath, category.name];
    const newPathIds = [...currentPathIds, category.id];

    // Verificar si es una categoría hoja
    const isLeaf = !category.children || category.children.length === 0;

    if (isLeaf) {
      // Es una hoja, agregarla al resultado
      const depto = await GetCategoryRelationships(category.id);
      leafs.push({
        id: category.id,
        name: category.name,
        description: category.description ?? null,
        path: newPath,
        pathString: newPath.join(" > "),
        pathIds: newPathIds,
        department:
          depto.data.length > 0
            ? {
                departmentId: depto.data[0].departmentId,
                color: depto.data[0].color,
              }
            : null,
      });
    } else {
      // No es una hoja, seguir buscando en sus hijos
      const childLeafs = await GetLeafCategories(
        category.children!,
        newPath,
        newPathIds
      );
      leafs = leafs.concat(childLeafs);
    }
  }

  return leafs;
}

export async function CreateDepartment(data: DepartmentFormData) {
  try {
    const { short_name, long_name, color, categories } = data;

    const [insertDepto] = await rmPool.query<ResultSetHeader>(
      `INSERT INTO QI_cat_departments (short_name, long_name, color, created_at) 
        VALUES (?, ?, ?, NOW());`,
      [short_name, long_name, color]
    );

    // Insertar relaciones en QI_cat_departments_relationships
    if (categories && categories.length > 0) {
      categories.forEach(async (id) => {
        await rmPool.query(
          `INSERT INTO QI_cat_departments_relationships (fk_department, fk_categorie, created_at) VALUES (?, ?, NOW());`,
          [insertDepto.insertId, id]
        );
      });
    }

    return {
      success: true,
      data: { departmentId: insertDepto.insertId },
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function UpdateDepartment(
  departmentId: number,
  data: DepartmentFormData
) {
  try {
    const { short_name, long_name, color, categories } = data;

    await rmPool.query(
      `UPDATE QI_cat_departments 
        SET short_name = ?, long_name = ?, color = ?, updated_at = NOW() 
        WHERE id = ?;`,
      [short_name, long_name, color, departmentId]
    );

    if (categories && categories.length > 0) {
      await UpdateCategories(departmentId, categories);
    }

    return {
      success: true,
      data: { departmentId: departmentId },
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function DeleteDepartment(departmentId: number) {
  try {
    // Eliminar relaciones existentes
    await rmPool.query(
      `DELETE FROM QI_cat_departments_relationships WHERE fk_department = ?;`,
      [departmentId]
    );

    // Eliminar el departamento
    await rmPool.query(`DELETE FROM QI_cat_departments WHERE id = ?;`, [
      departmentId,
    ]);

    return {
      success: true,
      data: { departmentId: departmentId },
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function UpdateCategories(
  departmentId: number,
  categories: number[]
) {
  try {
    if (categories && categories.length > 0) {
      // Eliminar relaciones existentes
      await rmPool.query(
        `DELETE FROM QI_cat_departments_relationships WHERE fk_department = ?;`,
        [departmentId]
      );

      // Insertar nuevas relaciones
      categories.forEach(async (id) => {
        await rmPool.query(
          `INSERT INTO QI_cat_departments_relationships (fk_department, fk_categorie, created_at) VALUES (?, ?, NOW());`,
          [departmentId, id]
        );
      });

      return {
        success: true,
        message: "Categorías actualizadas correctamente",
      };
    } else {
      return {
        success: false,
        message: "Ingresa al menos una categoría",
      };
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function AddCategoryToDepto(
  categoryId: number,
  departmentId: number
) {
  try {
    if (departmentId && categoryId) {
      const exists = await queryOneRM(
        `select count(*) as count from QI_cat_departments_relationships where fk_categorie = ?;`,
        [categoryId]
      );
      if (exists.count == 0) {
        //no existe relacion, inserta
        await rmPool.query(
          `INSERT INTO QI_cat_departments_relationships (fk_department, fk_categorie, created_at) VALUES (?, ?, NOW());`,
          [departmentId, categoryId]
        );
        return {
          success: true,
          message: "Categoría relacionada correctamente",
        };
      } else {
        //ya existe relacion, actualiza
        await rmPool.query(
          `UPDATE QI_cat_departments_relationships 
            SET fk_department = ?
            WHERE fk_categorie = ?;`,
          [departmentId, categoryId]
        );
        return {
          success: true,
          message: "Relación actualizada correctamente",
        };
      }
    } else {
      return {
        success: false,
        message: "Ingresa los datos correspondientes",
      };
    }
  } catch (error) {
    console.error("Error al asignar departamento", error);
    throw error;
  }
}
