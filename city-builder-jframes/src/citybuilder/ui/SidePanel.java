package citybuilder.ui;

import javax.swing.*;
import java.awt.*;
import java.awt.datatransfer.StringSelection;
import java.awt.dnd.*;

public class SidePanel extends JPanel {
    // Updated list of buildings based on your new logic
    private static final String[][] BUILDINGS = {
            {"Housing", "🏘️"},
            {"Factory", "🏭"},
            {"Park", "🌳"},
            {"Hospital", "🏥"},
            {"School", "🏫"},
            {"University", "🎓"},
            {"Museum", "🏛️"},
            {"Road", "🛣️"},
            {"Solar Panel", "☀️"},
            {"Wind Turbine", "🌬️"},
            {"Recycling", "♻️"},
            {"Water Plant", "🚰"},
            {"Landfill", "🗑️"},
            {"Hazard", "⚠️"},
            {"Police", "🚨"},
            {"Zoo", "🦁"},
            {"Water Tower", "💧"},
            {"Ambulance", "🚑"},
            {"Bamboo", "🎋"}
    };

    public SidePanel() {
        setLayout(new GridLayout(BUILDINGS.length, 1, 5, 5));
        setPreferredSize(new Dimension(150, 0));
        setBackground(new Color(45, 45, 45));

        for (String[] b : BUILDINGS) {
            // Label: "Emoji Name"
            JLabel lbl = new JLabel(b[1] + " " + b[0], SwingConstants.CENTER);
            lbl.setForeground(Color.WHITE);
            lbl.setOpaque(true);
            lbl.setBackground(new Color(70, 70, 70));
            lbl.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

            DragSource ds = new DragSource();
            ds.createDefaultDragGestureRecognizer(lbl, DnDConstants.ACTION_COPY, new DragGestureListener() {
                @Override
                public void dragGestureRecognized(DragGestureEvent dge) {
                    // Data transferred is just the emoji (b[1])
                    StringSelection transferable = new StringSelection(b[1]);
                    dge.startDrag(DragSource.DefaultCopyDrop, transferable);
                }
            });

            add(lbl);
        }
    }
}