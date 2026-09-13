import { IconPackageOff } from "@tabler/icons-react";

export function EmptyStockWidget() {
    return (
        <div
            style={{
                gridColumn: "1 / -1",
                width: "100%",
                minHeight: "240px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                }}
            >
                <div
                    style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "16px",
                        backgroundColor: "#f0fdf4",
                        color: "#15803d",
                    }}
                >
                    <IconPackageOff
                        size={34}
                        stroke={1.5}
                    />
                </div>

                <h3
                    style={{
                        margin: 0,
                        fontSize: "18px",
                        fontWeight: 600,
                        color: "#111827",
                    }}
                >
                    Aucun stock
                </h3>

                <p
                    style={{
                        margin: "6px 0 0",
                        maxWidth: "380px",
                        fontSize: "14px",
                        lineHeight: 1.5,
                        color: "#6b7280",
                    }}
                >
                    Aucun stock n'est actuellement associé à cette récolte.
                </p>
            </div>
        </div>
    );
}