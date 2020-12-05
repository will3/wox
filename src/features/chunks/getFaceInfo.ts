import { MeshData } from "./MeshData";
import { FaceInfo } from "./FaceInfo";

const getFaceInfo = (
  meshData: MeshData,
  faceIndex: number
): FaceInfo | null => {
  return meshData.faces[Math.floor(faceIndex / 2)];
};

export default getFaceInfo;
