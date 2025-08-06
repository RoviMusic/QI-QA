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
      cellFontSizeSM: 10,
    },
    InputNumber: {
      fontSizeSM: 10,
      activeBorderColor: '#FAB627',
    },
    Input: {
      fontSizeSM: 10,
    },
    Segmented: {
      itemActiveBg: '#FAB627',
      itemSelectedBg: '#FAB627',
      itemSelectedColor: '#fff'
    },
    Button: {
      colorBgContainerDisabled: '#D9D9D9'
    },
    Form: {
      itemMarginBottom: 0
    },
  },
};

export { defaultTheme };
