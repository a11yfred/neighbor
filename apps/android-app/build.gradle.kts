plugins {
    kotlin("jvm") version "1.9.22"
}

dependencies {
    compileOnly("com.android.tools.lint:lint-api:31.2.2")
    compileOnly("com.android.tools.lint:lint-checks:31.2.2")
}

tasks.jar {
    manifest {
        attributes(
            "Lint-Registry-v2" to "neighbor.android.lint.NeighborIssueRegistry"
        )
    }
}
