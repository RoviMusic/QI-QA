import { ThemeConfig } from "antd";

const defaultTheme: ThemeConfig = {
  token: {
    colorPrimary: "#FAB627",
    //colorLink: "#FAB627",
  },
  components: {
    Layout: {
      headerBg: "transparent",
      siderBg: "#0C0C0C",
    },
    Menu: {
      itemBg: "transparent",
      iconSize: 20,
      itemColor: "#000",
      itemHoverColor: "#FAB627",
    },
    Card: {
      bodyPadding: 20,
      bodyPaddingSM: 10,
    },
    Typography: {
      titleMarginBottom: 0,
    },
    Table: {
      cellFontSizeSM: 12,
      cellFontSize: 16,
      cellFontSizeMD: 14,
    },
    InputNumber: {
      fontSizeSM: 10,
      activeBorderColor: "#FAB627",
    },
    Input: {
      fontSizeSM: 10,
    },
    Segmented: {
      itemActiveBg: "#FAB627",
      itemSelectedBg: "#FAB627",
      itemSelectedColor: "#fff",
    },
    Button: {
      colorBgContainerDisabled: "#D9D9D9",
      defaultBg: "transparent",
      defaultBorderColor: "#FAB627",
    },
    Form: {
      itemMarginBottom: 0,
    },
    Transfer: {
      listWidth: 300,
    },
  },
};

export { defaultTheme };
