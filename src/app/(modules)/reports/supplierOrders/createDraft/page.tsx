'use client'
import { GlassCard } from "@/components/core/GlassCard";
import { MainTitle } from "@/components/core/Titulo";
import Container from "@/components/layout/Container";
import { Flex, Input, Radio, Tabs } from "antd";
import type { TabsProps } from "antd";

export default function CreateDraftPage() {
  return (
    <>
      <Container>
        <Flex vertical gap={20}>
          <MainTitle>Crear borrador</MainTitle>

          <GlassCard>
            <Flex vertical>
              <Radio.Group
                name="draft"
                defaultValue={1}
                options={[
                  { value: 1, label: "General" },
                  { value: 2, label: "Addenda" },
                ]}
              />

              <Input type="file"/>
            </Flex>
          </GlassCard>
        </Flex>
      </Container>
    </>
  );
}
