import {
  MantineThemeOverride
} from '@mantine/core';

export const theme: MantineThemeOverride = {
  "colorScheme": "dark",
  "fontFamily": "Motiva Sans",
  "colors": {
    "progress": [
      "#dee2e6",
    ],
    "lighter": [
      "rgb(200, 195, 185)", // Icon Colors, Button Text Color, Header Text Color - Darkened Platinum
      "rgb(15, 40, 65)", // Main Background Color (Body) - Deeper Dark Blue
      "rgb(35, 60, 85)", // Secondary Background Color (Header, Description, Button:!hover) - Slightly Lighter Dark Blue
      "rgb(25, 70, 95)", // Button Hover Color - Even Lighter Dark Blue
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
    },
  },

  "primaryColor": "blue",
  "primaryShade": 6
};
