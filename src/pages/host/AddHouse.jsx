import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Upload, X, CheckCircle } from "lucide-react";
import { createHouse } from "../../store/housesSlice.js";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import Textarea from "../../components/ui/Textarea.jsx";
import { AMENITIES, ROUTES } from "../../constants/index.js";

const AddHouse = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { actionLoading } = useSelector((s) => s.houses);

  const [form, setForm] = useState({
    name: "",
    price: "",
    location: "",
    description: "",
    capacity: "4",
    amenities: [],
  });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const intervalRef = useRef(null);

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
      clearInterval(intervalRef.current);
    };
  }, [previews]);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const toggleAmenity = (value) =>
    setForm((p) => ({
      ...p,
      amenities: p.amenities.includes(value)
        ? p.amenities.filter((a) => a !== value)
        : [...p.amenities, value],
    }));

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files);
    e.target.value = null; // allow re-selecting same file

    for (const file of selected) {
      if (file.size > 2 * 1024 * 1024)
        return setError(`"${file.name}" exceeds the 2 MB limit.`);
    }

    const combined = [...files, ...selected];
    if (combined.length > 2) return setError("Maximum 2 photos allowed.");

    const hasDuplicate = selected.some((f) =>
      files.some((ex) => ex.name === f.name && ex.size === f.size),
    );
    if (hasDuplicate) return setError("Duplicate image not allowed.");

    setFiles(combined);
    setPreviews(combined.map((f) => URL.createObjectURL(f)));
    setError("");
  };

  const removeFile = (idx) => {
    URL.revokeObjectURL(previews[idx]);
    setFiles((p) => p.filter((_, i) => i !== idx));
    setPreviews((p) => p.filter((_, i) => i !== idx));
  };

  // Fake upload progress (real progress via onUploadProgress)
  const startFakeProgress = () => {
    setProgress(0);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) {
          clearInterval(intervalRef.current);
          return p;
        }
        return p + 2;
      });
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (files.length === 0) return setError("At least one photo is required.");

    const price = parseFloat(form.price);
    const capacity = parseInt(form.capacity, 10);

    if (isNaN(price) || price < 400 || price > 1000)
      return setError("Price must be between ₹400 and ₹1000.");
    if (isNaN(capacity) || capacity < 1 || capacity > 20)
      return setError("Capacity must be between 1 and 20.");

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("location", form.location);
    formData.append("description", form.description);
    formData.append("capacity", form.capacity);
    if (form.amenities.length > 0)
      formData.append("amenities", form.amenities.join(","));
    files.forEach((f) => formData.append("photos", f));

    try {
      startFakeProgress();
      await dispatch(
        createHouse({ formData, onUploadProgress: setProgress }),
      ).unwrap();

      clearInterval(intervalRef.current);
      setProgress(100);
      setSuccess(true);

      // Reset form
      setForm({
        name: "",
        price: "",
        location: "",
        description: "",
        capacity: "4",
        amenities: [],
      });
      setFiles([]);
      setPreviews([]);
      setTimeout(() => {
        setProgress(0);
        navigate(ROUTES.HOST_HOUSES);
      }, 1500);
    } catch (err) {
      clearInterval(intervalRef.current);
      setProgress(0);
      setError(err ?? "Failed to add house. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen px-4 py-10"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <div className="max-w-lg mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--text)]">
            List a new property
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the details below to publish your listing.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm flex items-center gap-2">
            <CheckCircle size={16} />
            House listed successfully! Redirecting…
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Name */}
          <Input
            label="House name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Cozy Mountain Retreat"
            required
            maxLength={100}
          />

          {/* Price + Capacity */}
          <div className="flex gap-3">
            <Input
              label="Price per night (₹400–₹1000)"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="700"
              min="400"
              max="1000"
              required
              containerClassName="flex-1"
            />
            <Input
              label="Max guests (1–20)"
              name="capacity"
              type="number"
              value={form.capacity}
              onChange={handleChange}
              placeholder="4"
              min="1"
              max="20"
              required
              containerClassName="flex-1"
            />
          </div>

          {/* Location */}
          <Input
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. Manali, Himachal Pradesh"
            required
            maxLength={200}
          />

          {/* Description */}
          <Textarea
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe your property (20–1000 characters)"
            required
            minLength={20}
            maxLength={1000}
            rows={4}
          />

          {/* Amenities */}
          <div>
            <label className="text-sm font-medium text-[var(--text)] opacity-80 block mb-2">
              Amenities{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => toggleAmenity(value)}
                  className={`
                    px-3 py-1.5 rounded-full text-xs font-medium border transition-colors
                    ${
                      form.amenities.includes(value)
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-blue-400"
                    }
                  `}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Photos */}
          <div>
            <label className="text-sm font-medium text-[var(--text)] opacity-80 block mb-2">
              Photos{" "}
              <span className="text-gray-400 font-normal">
                (1–2 images, max 2 MB each)
              </span>
            </label>

            <label
              className={`
                flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition-colors
                ${
                  files.length >= 2
                    ? "border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed"
                    : "border-gray-300 dark:border-gray-600 hover:border-blue-400 bg-gray-50 dark:bg-gray-900/30"
                }
              `}
            >
              <Upload size={22} className="text-gray-400 mb-1" />
              <span className="text-sm text-gray-500">
                {files.length >= 2
                  ? "Maximum photos reached"
                  : "Click to upload photos"}
              </span>
              <input
                type="file"
                accept="image/jpg,image/jpeg,image/png"
                multiple
                onChange={handleFiles}
                disabled={files.length >= 2}
                className="hidden"
              />
            </label>

            {/* Previews */}
            {previews.length > 0 && (
              <div className="flex gap-3 mt-3 flex-wrap">
                {previews.map((url, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={url}
                      alt={`Preview ${idx + 1}`}
                      className="w-24 h-24 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                      aria-label="Remove photo"
                    >
                      <X size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upload progress */}
          {actionLoading && progress > 0 && (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-1.5 bg-blue-600 rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          <Button type="submit" loading={actionLoading} fullWidth size="lg">
            {actionLoading ? "Uploading…" : "Publish listing"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddHouse;
