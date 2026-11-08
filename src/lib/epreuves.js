import cloudinary from "@/lib/cloudinary";

// Retire du document tout ce qui permettrait de recuperer le fichier sans etre connecte.
export function versionPublique(epreuve) {
  const { fichierUrl, apercuId, ...reste } = epreuve;
  return { ...reste, aApercu: Boolean(apercuId) };
}

// Envoie une copie privee du PDF a Cloudinary pour pouvoir en tirer l'image de la 1re page.
// En cas d'echec, la publication continue simplement sans apercu.
export async function creerApercu(buffer) {
  try {
    const resultat = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "image", type: "authenticated", folder: "examhub/apercus" },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      stream.end(buffer);
    });
    return resultat.public_id;
  } catch (err) {
    console.error("Erreur creation apercu:", err.message);
    return null;
  }
}

// URL signee (jamais envoyee au navigateur) : uniquement le haut de la page 1,
// en basse resolution, avec un filigrane.
export function urlApercu(apercuId) {
  return cloudinary.url(apercuId, {
    resource_type: "image",
    type: "authenticated",
    sign_url: true,
    secure: true,
    format: "jpg",
    transformation: [
      { page: 1, width: 800, crop: "scale" },
      { width: "1.0", height: "0.4", crop: "crop", gravity: "north" },
      {
        overlay: { font_family: "Arial", font_size: 70, font_weight: "bold", text: "ExamHECM" },
        color: "#008843",
        opacity: 20,
        angle: -20,
      },
      { quality: 60 },
    ],
  });
}
