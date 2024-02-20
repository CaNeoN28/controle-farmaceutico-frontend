import {setDefaults, OutputFormat} from "react-geocode"

export default function geocodeSetDefaults() {
	setDefaults({
		key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "",
		region: "br",
		language: "pt",
		outputFormat: OutputFormat.JSON,
	});
}