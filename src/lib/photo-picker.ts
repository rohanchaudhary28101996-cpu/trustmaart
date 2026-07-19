import { Capacitor } from "@capacitor/core";

export type PickedFile = { blob: Blob; name: string };

export async function pickPhotos(multiple = true): Promise<PickedFile[]> {
  if (!Capacitor.isNativePlatform()) {
    return pickFromInput(multiple);
  }

  const { Camera, CameraSource, CameraResultType } = await import("@capacitor/camera");

  const source = await showSourceDialog();
  if (!source) return [];

  if (source === "camera") {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      quality: 85,
    });
    if (!photo.base64String) return [];
    const blob = base64ToBlob(photo.base64String, `image/${photo.format}`);
    return [{ blob, name: `photo_${Date.now()}.${photo.format}` }];
  } else {
    const result = await Camera.pickImages({
      quality: 85,
      limit: multiple ? 10 : 1,
    });
    const files: PickedFile[] = [];
    for (const img of result.photos) {
      if (!img.base64String) continue;
      const blob = base64ToBlob(img.base64String, `image/${img.format}`);
      files.push({ blob, name: `photo_${Date.now()}_${files.length}.${img.format}` });
    }
    return files;
  }
}

function base64ToBlob(base64: string, mime: string): Blob {
  const bytes = atob(base64);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

function showSourceDialog(): Promise<"camera" | "gallery" | null> {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.style.cssText = `position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.5);display:flex;align-items:flex-end;`;

    const sheet = document.createElement("div");
    sheet.style.cssText = `background:white;width:100%;border-radius:16px 16px 0 0;padding:16px;`;
    sheet.innerHTML = `
      <div style="font-weight:600;font-size:16px;margin-bottom:12px;text-align:center;">Add Photo</div>
      <button id="tm-cam" style="display:block;width:100%;padding:14px;margin-bottom:8px;border-radius:12px;border:1px solid #e5e7eb;font-size:15px;background:white;cursor:pointer;">📷 Take Photo</button>
      <button id="tm-gal" style="display:block;width:100%;padding:14px;margin-bottom:8px;border-radius:12px;border:1px solid #e5e7eb;font-size:15px;background:white;cursor:pointer;">🖼️ Choose from Gallery</button>
      <button id="tm-cancel" style="display:block;width:100%;padding:14px;border-radius:12px;border:none;font-size:15px;background:#f3f4f6;cursor:pointer;color:#6b7280;">Cancel</button>
    `;

    overlay.appendChild(sheet);
    document.body.appendChild(overlay);

    const cleanup = () => document.body.removeChild(overlay);
    sheet.querySelector("#tm-cam")!.addEventListener("click", () => { cleanup(); resolve("camera"); });
    sheet.querySelector("#tm-gal")!.addEventListener("click", () => { cleanup(); resolve("gallery"); });
    sheet.querySelector("#tm-cancel")!.addEventListener("click", () => { cleanup(); resolve(null); });
    overlay.addEventListener("click", (e) => { if (e.target === overlay) { cleanup(); resolve(null); } });
  });
}

function pickFromInput(multiple: boolean): Promise<PickedFile[]> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/webp";
    input.multiple = multiple;
    input.onchange = () => {
      const files = Array.from(input.files ?? []);
      resolve(files.map((f) => ({ blob: f, name: f.name })));
    };
    input.click();
  });
}
