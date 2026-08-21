use std::{env, fs, path::Path};

fn write_fallback_ico(path: &Path) {
    const W: u32 = 32;
    const H: u32 = 32;
    let pixel_bytes = W * H * 4;
    let mask_row = ((W + 31) / 32) * 4;
    let mask_bytes = mask_row * H;
    let image_size = 40 + pixel_bytes + mask_bytes;
    let offset = 6 + 16;
    let mut ico = Vec::with_capacity(offset + image_size as usize);

    ico.extend_from_slice(&0u16.to_le_bytes());
    ico.extend_from_slice(&1u16.to_le_bytes());
    ico.extend_from_slice(&1u16.to_le_bytes());
    ico.extend_from_slice(&[32, 32, 0, 0]);
    ico.extend_from_slice(&1u16.to_le_bytes());
    ico.extend_from_slice(&32u16.to_le_bytes());
    ico.extend_from_slice(&image_size.to_le_bytes());
    ico.extend_from_slice(&(offset as u32).to_le_bytes());

    ico.extend_from_slice(&40u32.to_le_bytes());
    ico.extend_from_slice(&W.to_le_bytes());
    ico.extend_from_slice(&(H * 2).to_le_bytes());
    ico.extend_from_slice(&1u16.to_le_bytes());
    ico.extend_from_slice(&32u16.to_le_bytes());
    ico.extend_from_slice(&0u32.to_le_bytes());
    ico.extend_from_slice(&pixel_bytes.to_le_bytes());
    ico.extend_from_slice(&[0u8; 16]);

    // Simple SCIEX-blue opaque icon pixels, stored bottom-up as BGRA.
    for y in 0..H {
        for x in 0..W {
            let dx = x as i32 - 16;
            let dy = y as i32 - 16;
            let inside = dx * dx + dy * dy <= 14 * 14;
            if inside {
                ico.extend_from_slice(&[210, 112, 35, 255]);
            } else {
                ico.extend_from_slice(&[0, 0, 0, 0]);
            }
        }
    }
    ico.resize(ico.len() + mask_bytes as usize, 0);
    let _ = fs::write(path, ico);
}

fn main() {
    let manifest = env::var("CARGO_MANIFEST_DIR").unwrap();
    let icon_dir = Path::new(&manifest).join("icons");
    let icon = icon_dir.join("icon.ico");
    if !icon.exists() {
        fs::create_dir_all(&icon_dir).unwrap();
        write_fallback_ico(&icon);
    }
    println!("cargo:rerun-if-changed=build.rs");
    tauri_build::build();
}
