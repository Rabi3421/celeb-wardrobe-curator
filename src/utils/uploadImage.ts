import { storage } from "../components/ui/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function uploadImageToFirebase(file: File): Promise<string> {
  const storageRef = ref(storage, `celebrities/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}