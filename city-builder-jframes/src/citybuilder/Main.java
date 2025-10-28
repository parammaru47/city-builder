package citybuilder;

import javax.swing.SwingUtilities;
import citybuilder.ui.CityBuilderFrame;

public class Main {
    public static void main(String[] args) {
        SwingUtilities.invokeLater(CityBuilderFrame::new);
    }
}
