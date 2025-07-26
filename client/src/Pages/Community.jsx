import React, { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Heart } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useUser();
  const { getToken } = useAuth();

  // ✅ Fetch Creations
  const fetchCreations = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/user/get-published-creations", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success && Array.isArray(data.creations)) {
        setCreations(data.creations);
      } else {
        toast.error(data.message || "Failed to load creations");
        setCreations([]);
      }
    } catch (error) {
      toast.error(error.message);
      setCreations([]);
    }
    setLoading(false);
  };

  // ✅ Toggle Like
  const imageLikeToggle = async (id) => {
  // ✅ 1. Instantly update UI (optimistic update)
  setCreations((prev) =>
    prev.map((creation) =>
      creation.id === id
        ? {
            ...creation,
            likes: creation.likes?.includes(user?.id)
              ? creation.likes.filter((uid) => uid !== user?.id)
              : [...(creation.likes || []), user?.id],
          }
        : creation
    )
  );

  try {
    const token = await getToken();
    const { data } = await axios.post(
      "/api/user/toggle-like-creations",
      { id },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!data.success) {
      toast.error(data.message || "Failed to toggle like");
      fetchCreations(); // 🔄 revert if API fails
    } else {
      toast.success(data.message);
    }
  } catch (error) {
    toast.error(error.message);
    fetchCreations(); // 🔄 revert if API fails
  }
};


  useEffect(() => {
    if (user) fetchCreations();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="w-10 h-10 my-1 rounded-full border-4 border-primary border-t-transparent animate-spin"></span>
      </div>
    );
  }

  return !loading ? (
    <div className="flex-1 h-full flex flex-col gap-4 p-6">
      <h2 className="text-xl font-semibold mb-2">Creations</h2>

      <div className="bg-white h-full w-full rounded-xl overflow-y-scroll">
        {creations.length > 0 ? (
          creations.map((creation, index) => (
            <div
              key={index}
              className="relative group inline-block pl-3 pt-3 w-full sm:max-w-[50%] lg:max-w-[33%]"
            >
              <img
                src={creation.content}
                alt={creation.prompt || "User creation"}
                className="w-full h-full object-cover rounded-lg"
              />

              <div className="absolute inset-0 left-3 flex gap-2 items-end justify-end p-3 text-white rounded-lg group-hover:justify-between group-hover:bg-gradient-to-b from-transparent to-black/80">
                <p className="text-sm hidden group-hover:block">
                  {creation.prompt || "Untitled Creation"}
                </p>

                <div className="flex gap-1 items-center">
                  <p>{creation.likes?.length || 0}</p>
                  <Heart
                    onClick={() => imageLikeToggle(creation.id)}
                    className={`min-w-5 h-5 hover:scale-110 cursor-pointer ${
                      creation.likes?.includes(user?.id)
                        ? "fill-red-500 text-red-600"
                        : "text-white"
                    }`}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center p-4 text-gray-500">No creations found.</p>
        )}
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center h-full">
      <span className="w-10 h-10 my-1 rounded-full border-3 border-primary border-t-transparent animate-spin"></span>
    </div>
  )
};

export default Community;
