import "./globals.css";

export const metadata = {
	title: "Controle de plantão farmacêutico",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="pt-br">
			<head>
				<link
					rel="stylesheet"
					href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
					integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
					crossOrigin=""
				/>
				<link rel="icon" href="/favicon.svg" sizes="any" />
			</head>
			<body>{children}</body>
		</html>
	);
}
