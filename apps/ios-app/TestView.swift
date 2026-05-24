import SwiftUI

struct TestView: View {
    var body: some View {
        VStack {
            // Intentional accessibility violation for a11y-check to catch:
            // Button missing an accessibility label or visible text
            Button(action: {
                print("Clicked")
            }) {
                Image(systemName: "star")
            }
            
            // Text that is too small (might trigger dynamic type or contrast checks depending on setup)
            Text("Small text")
                .font(.system(size: 8))
        }
    }
}
