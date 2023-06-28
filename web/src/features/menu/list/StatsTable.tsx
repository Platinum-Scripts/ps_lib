import React from 'react';
import { Table, Text, Progress, createStyles } from '@mantine/core';
import { MenuPosition } from '../../../typings';

type Stat = {
    label: string;
    value: number;
};

type StatsTableProps = {
    stats: Stat[];
    params: { position?: MenuPosition; itemCount: number; selected: number }
};

const useStyles = createStyles((theme, params: { position?: MenuPosition; itemCount: number; selected: number }) => ({
    radius: {
        borderRadius: theme.radius.sm,
    },
    main: {
        marginTop: params.position === 'top-left' || params.position === 'top-right' ? 8 : 2,
        marginLeft: params.position === 'top-left' || params.position === 'bottom-left' ? 8 : 2,
        marginRight: params.position === 'top-right' || params.position === 'bottom-right' ? 8 : 2,
        marginBottom: params.position === 'bottom-left' || params.position === 'bottom-right' ? 8 : 2,
        right: params.position === 'top-right' || params.position === 'bottom-right' ? 1 : undefined,
        left: params.position === 'bottom-left' ? 1 : undefined,
        bottom: params.position === 'bottom-left' || params.position === 'bottom-right' ? 1 : undefined,

        backgroundColor: `rgba(${theme.colors.darker[0].replace("rgb(", "").replace(")", "")}, 0.70)`,
        color: theme.colors.lighter[0],
        borderRadius: theme.radius.md,
        borderTopLeftRadius: theme.radius.md,
        borderTopRightRadius: theme.radius.md,
        borderBottomLeftRadius: theme.radius.md,
        borderBottomRightRadius: theme.radius.md,
        maxWidth: 350,
        whiteSpace: 'normal',
        pointerEvents: 'none',
        border: "none",
        transform: "translateX(50px)",
        width: 'auto',
        fontSize: theme.fontSizes.xs,
    },

    smallerText: {
        fontSize: theme.fontSizes.sm,
        scale: 0.75
    },

    smallerColumn: {
        width: '25%',
    },
}));

const StatsTable: React.FC<StatsTableProps> = ({ stats, params }) => {
    const { classes } = useStyles(params);

    return (
        <Table className={classes.main} cellSpacing={0} cellPadding={0} style={{ border: 'none' }}>
            <tbody style={{ border: 'none' }}>
                {stats.map((stat, index) => (
                    <tr key={index} style={{ border: 'none' }}>
                        <td style={{ border: 'none', width: '30%' }}>
                            <Text className={classes.smallerText}>{stat.label}</Text>
                        </td>
                        <td style={{ border: 'none', width: '70%' }}>
                            <Progress
                                radius={0}
                                value={stat.value}
                                color="rgb(255, 0, 0, 1.0)"
                                style={{
                                    backgroundColor: 'rgb(68, 68, 68, 1.0)',
                                    width: '100%',
                                }}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default StatsTable;