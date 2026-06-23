"use client";

type FileUploadFieldProps = {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  accept?: string;
  resourceType?: "image" | "raw";
};

export default function FileUploadField({
  label,
  value = "",
  onChange,
  accept,
}: FileUploadFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-[0.8px]">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Enter ${label.toLowerCase()} URL`}
        className="w-full text-[13px] text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-[11px] px-3.5 py-2.5 outline-none focus:border-[#1a6fd4] focus:ring-2 focus:ring-[#1a6fd4]/10 transition-all bg-white"
      />

      <input
        type="file"
        accept={accept}
        className="w-full text-[13px] text-slate-700 border border-slate-200 rounded-[11px] px-3.5 py-2.5 bg-white"
      />
    </div>
  );
}