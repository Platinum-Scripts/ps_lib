import { Box, Group, Stack, Text, Progress, Image } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { forwardRef } from 'react';
import CustomCheckbox from './CustomCheckbox';
import type { MenuItem } from '../../../typings';
import { createStyles } from '@mantine/core';
import { isIconUrl } from '../../../utils/isIconUrl';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { titleCase } from "title-case";

interface Props {
  item: MenuItem;
  index: number;
  scrollIndex: number;
  checked: boolean;
  ref: React.Ref<HTMLDivElement>; // Change the type to React.Ref<HTMLDivElement>
}

const useStyles = createStyles((theme, params: {
  rightIconColor?: string; iconColor?: string 
}) => ({
  buttonContainer: {
    backgroundColor: theme.colors.dark[6],
    borderRadius: theme.radius.md,
    padding: 2,
    height: 60,
    scrollMargin: 8,
    '&:focus': {
      backgroundColor: theme.colors.dark[4],
      outline: 'none',
    },
  },
  iconImage: {
    maxWidth: 32,
  },
  buttonWrapper: {
    paddingLeft: 5,
    paddingRight: 12,
    height: '100%',
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    width: 32,
    height: 32,
  },
  icon: {
    fontSize: 24,
    color: params.iconColor || theme.colors.lighter[1],
  },
  rightIcon: {
    fontSize: "1.5em",
    color: params.rightIconColor || theme.colors.lighter[1],
  },
  label: {
    color: theme.colors.lighter[1],
    textTransform: 'none',
    fontSize: 12,
    verticalAlign: 'middle',
  },
  chevronIcon: {
    fontSize: 14,
    color: theme.colors.lighter[1],
  },
  scrollIndexValue: {
    color: theme.colors.lighter[1],
    textTransform: 'none',
    fontSize: 14,
  },
  progressStack: {
    width: '100%',
    marginRight: 5,
  },
  progressLabel: {
    verticalAlign: 'middle',
    marginBottom: 3,
  },
}));

const ListItem = forwardRef<HTMLDivElement, Props>(({ item, index, scrollIndex, checked }, ref) => {
  const { classes } = useStyles({
    iconColor: item.iconColor,
    rightIconColor: item.rightIconColor,
  });

  return (
    <Box
      tabIndex={index}
      className={classes.buttonContainer}
      key={`item-${index}`}
      ref={ref} // Update the ref assignment
    >
      <Group spacing={15} noWrap className={classes.buttonWrapper}>
        {item.icon && (
          <Box className={classes.iconContainer}>
            {typeof item.icon === 'string' && isIconUrl(item.icon) ? (
              <img src={item.icon} alt="Missing image" className={classes.iconImage} />
            ) : (
              <i className={`fa-solid fa-fw findme ${item.icon} ${classes.icon}`}/>
            )}
          </Box>
        )}
        {Array.isArray(item.values) ? (
          <Group position="apart" w="100%">
            <Stack spacing={0} justify="space-between">
              <Text className={classes.label}>{titleCase(item.label)}</Text>
              <Text>
                {typeof item.values[scrollIndex] === 'object'
                  ? // @ts-ignore for some reason even checking the type TS still thinks it's a string
                  item.values[scrollIndex].label
                  : item.values[scrollIndex]}
              </Text>
            </Stack>
            <Group spacing={1} position="center">
              <i className={`fa-solid fa-chevron-left`}></i>
              <Text className={classes.scrollIndexValue}>
                {scrollIndex + 1}/{item.values.length}
              </Text>
              <i className={`fa-solid fa-chevron-right`}></i>
            </Group>
          </Group>
        ) : item.checked !== undefined ? (
          <Group position="apart" w="100%">
            <Text>{item.label}</Text>
            <CustomCheckbox checked={checked}></CustomCheckbox>
          </Group>
        ) : item.progress !== undefined ? (
          <Stack className={classes.progressStack} spacing={0}>
            <Text className={classes.progressLabel}>{item.label}</Text>
            <Progress
              value={item.progress}
              color={item.colorScheme || 'dark.0'}
              styles={(theme) => ({ root: { backgroundColor: theme.colors.dark[3] } })}
            />
          </Stack>
        ) : item.rightIcon !== undefined ? (
          <Group position="apart" w="100%">
            <Text>{item.label}</Text>
            <i className={`fa-fw ${item.rightIcon} ${classes.rightIcon}`}></i>
          </Group>
        ) : (
          <Text>{titleCase(item.label)}</Text>
        )}
      </Group>
    </Box>
  );
});

export default React.memo(ListItem);
