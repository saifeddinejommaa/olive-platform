import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";

type BooleanInfoCardProps = {
    value: boolean;
};

export default function BooleanInfoCard({
    value,
}: BooleanInfoCardProps) {
    return (
        <div
            style={{
                width: "fit-content",
                padding: "4px 8px",
                borderRadius: "12px",
                background: value ? "#16a34a" : "#dc2626",
                border: "1px solid #d1d5db",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                fontSize: "12px",
                fontWeight: 600,
                color: "#fff",
            }}
        >
            {value ? (
                <CheckCircleIcon fontSize="small" />
            ) : (
                <CloseIcon fontSize="small" />
            )}

            <span>{value ? "Oui" : "Non"}</span>
        </div>
    );
}