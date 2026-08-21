# SCIEX Desktop

SCIEX can now run as a native desktop application using Tauri 2. The existing HTML/CSS/JavaScript application is embedded into the desktop binary, so the installed application does not need Chrome or a local web server.

## Windows development

Install these prerequisites:

1. Node.js LTS
2. Rust stable with Cargo
3. Microsoft Visual Studio Build Tools with the Desktop development with C++ workload
4. Microsoft Edge WebView2 Runtime (normally already present on modern Windows)

Then from the SCIEX repository root:

```powershell
npm install
npm run tauri dev
```

## Build a Windows installer

```powershell
npm install
npm run tauri build
```

The generated installers are placed under:

`src-tauri/target/release/bundle/`

The configured Windows bundles are NSIS (`.exe`) and MSI (`.msi`).

## Important architecture decision

The frontend remains the existing SCIEX application. Tauri is the desktop shell only. This means the Physics and Astronomy modules do not need to be rewritten merely to become desktop modules.

Future scientific engines can be moved into reusable Rust or TypeScript modules without changing the desktop shell.

## Offline behavior

The frontend assets are embedded from the repository root through `frontendDist`. SCIEX therefore does not require Chrome, a localhost server, or an internet connection to launch the bundled application. External network resources used by individual legacy modules may still require internet access until those modules are made fully self contained.

## Release builds

A GitHub Actions workflow is provided for Windows desktop builds. It is intentionally manual/tag driven rather than running a full installer build on every commit.
