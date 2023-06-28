import React from 'react';
import { Table, Text, Progress, createStyles } from '@mantine/core';
import { MenuPosition } from '../../../typings';

type Stat = {
    label: string;
    value: number;
};

type StatsTableProps = {
    stats: Stat[];
    params: { position?: MenuPosition; itemCount: number; selected: number, hasFooter: boolean },
};

const useStyles = createStyles((theme, params: { position?: MenuPosition; itemCount: number; selected: number, hasFooter: boolean }) => ({
    radius: {
        borderRadius: theme.radius.sm,
    },
    main: {

        // if hasFooter, then position NEEDS to be under .mantine-Tooltip-tooltip, otherwise inherit
        // position: params.hasFooter ? 'absolute' : 'inherit',


        marginTop: params.position === 'top-left' || params.position === 'top-right' ? 8 : 2,
        marginLeft: params.position === 'top-left' || params.position === 'bottom-left' ? 8 : 2,
        marginRight: params.position === 'top-right' || params.position === 'bottom-right' ? 8 : 2,
        marginBottom: params.position === 'bottom-left' || params.position === 'bottom-right' ? 8 : 2,
        right: params.position === 'top-right' || params.position === 'bottom-right' ? 1 : undefined,
        left: params.position === 'bottom-left' ? 1 : undefined,
        bottom: params.position === 'bottom-left' || params.position === 'bottom-right' ? 1 : undefined,

        backgroundColor: `rgba(${theme.colors.lighter[1].replace("rgb(", "").replace(")", "")}, 0.70)`,
        color: theme.colors.lighter[0],
        borderRadius: theme.radius.md,
        borderTopLeftRadius: theme.radius.md,
        borderTopRightRadius: theme.radius.md,
        borderBottomLeftRadius: theme.radius.md,
        borderBottomRightRadius: theme.radius.md,
        maxWidth: 350,
        whiteSpace: 'normal',
        pointerEvents: 'none',
        border: "none"
    }
}));

const StatsTable: React.FC<StatsTableProps> = ({ stats, params }) => {

    // get position of .mantine-Tooltip-tooltip


    // if params.hasFooter, then position NEEDS to be under .mantine-Tooltip-tooltip, otherwise inherit
    if (params.hasFooter) {
        const tooltip = document.getElementsByClassName('mantine-Tooltip-tooltip');
        if (tooltip && typeof tooltip === "object") {
            if (tooltip.length > 0 && typeof tooltip[0] === "object") {
                const tip = tooltip[0] as HTMLElement;
                if (tip) {
                    let pos = tip.getBoundingClientRect();
                    console.log("pos", pos)
                }
            }
        }
    } else {
        console.log("noFooter", params)
    }

    const { classes } = useStyles(params);

    return (
        <Table style={{ backgroundColor: 'rgba(0, 0, 0, 200)' }} className={classes.main}>
            <tbody style={{ border: "none" }}>
                {stats.map((stat, index) => (
                    <tr key={index} style={{ border: "none" }}>
                        <td style={{ border: "none", width: '30%' }}>
                            <Text>{stat.label}</Text>
                        </td>
                        <td style={{ border: "none", width: '70%' }}>
                            <Progress
                                radius={0}
                                value={stat.value}
                                color="red"
                                style={{
                                    backgroundColor: 'rgba(255, 0, 0, 255)',
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