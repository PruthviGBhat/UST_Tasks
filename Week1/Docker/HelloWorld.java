
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        if (args.length > 0) {
            System.out.println("Args I received:");
            for (int i = 0; i < args.length; i++) {
                System.out.println("  [" + i + "]: " + args[i]);
            }
        } else {
            System.out.println("(No args passed)");
        }
    }
}


