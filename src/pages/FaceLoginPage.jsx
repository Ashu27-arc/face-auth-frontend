import FaceLogin from "../components/FaceLogin";

export default function FaceLoginPage() {
  return (
    <div className="h-screen flex justify-center items-center bg-gray-200">
      <div className="p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Face Login</h2>
        <FaceLogin />
      </div>
    </div>
  );
}
