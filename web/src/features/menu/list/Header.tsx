import { Box, createStyles, Text } from '@mantine/core';
import React from 'react';
import { titleCase } from "title-case";

const useStyles = createStyles((theme) => ({
  container: {
    textAlign: 'center',
    borderTopLeftRadius: theme.radius.md,
    borderTopRightRadius: theme.radius.md,
    backgroundColor: theme.colors.lighter[1],
    height: 60,
    width: 384,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    "fontSize": 28,
    "textTransform": 'none',
    "fontWeight": "bold",
    "fontFamily": "Motiva Sans",
  }
}));

const Header: React.FC<{ title: string }> = ({ title }) => {
  const { classes } = useStyles();

  return (
    <Box className={classes.container}>
      <Text className={classes.heading}>{titleCase(title)}</Text>
    </Box>
  );
};

export default React.memo(Header);
