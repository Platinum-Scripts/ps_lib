import {
  MantineThemeOverride
} from '@mantine/core';

export const theme: MantineThemeOverride = {
  "colorScheme": "dark",
  "fontFamily": "Roboto",
  "colors": {
    "gray": [
      "#f8f9fa",
      "#f1f3f5",
      "#e9ecef",
      "#dee2e6",
      "#ced4da",
      "#adb5bd",
      "#868e96",
      "#495057",
      "#343a40",
      "#212529"
    ],
    "lighter": [
      "rgb(190 190 190)", // Icon Colors, Button Text Color, Header Text Color
    ]
  },
  "shadows": {
    "sm": "1px 1px 3px rgba(0, 0, 0, 0.3)"
  },
  "components": {
    "Button": {
      "styles": {
        "root": {
          "border": "none",
          "backgroundColor": "#495057",
          "color": "#f1f3f5"
        }
      }
    }
  },
  "primaryColor": "blue",
  "primaryShade": 6
};
