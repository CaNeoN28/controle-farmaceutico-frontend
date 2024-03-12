import styles from "./Map.module.scss";
import { Loader } from "@googlemaps/js-api-loader";
import LeafLet from "leaflet";
import { Coordenadas } from "@/types/Localizacao";
import React, { Dispatch, SetStateAction } from "react";

interface Props {
	map_center?: Coordenadas;
	map_options?: google.maps.MapOptions;
	setLocalizacao?: Dispatch<SetStateAction<Coordenadas>>;
}

export default class Map extends React.Component {
	props: Props = {};
	map: LeafLet.Map | undefined = undefined;

	constructor(props: Props) {
		super(props);

		this.props = props;
	}

	componentDidMount(): void {
		const { map_center } = this.props;

		if (this.map === undefined) {
			let map = LeafLet.map("map").setView(
				[map_center?.lat || 0, map_center?.lng || 0],
				18
			);

			LeafLet.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
				maxZoom: 19,
				attribution:
					'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			}).addTo(map);

			this.map = map;
		}
	}

	componentDidUpdate(): void {
		const { map_center } = this.props;

		if (this.map) {
			this.map.remove()
			
			let map = LeafLet.map("map").setView(
				[map_center?.lat || 0, map_center?.lng || 0],
				18
			);

			LeafLet.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
				maxZoom: 19,
				attribution:
					'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			}).addTo(map);

			this.map = map;
		}
	}

	shouldComponentUpdate(nextProps: Props) {
		if (this.props.map_center && nextProps.map_center) {
			if (this.props.map_center.lat === nextProps.map_center.lat) {
				return false;
			} else {
				return true;
			}
		}

		return false;
	}

	render(): React.ReactNode {
		/* const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "",
    });

    let map: google.maps.Map | undefined = undefined;

    loader.load().then(async () => {
      const { Map } = (await google.maps.importLibrary(
        "maps"
      )) as google.maps.MapsLibrary;
      const { AdvancedMarkerElement } = (await google.maps.importLibrary(
        "marker"
      )) as google.maps.MarkerLibrary;

      map = new Map(document.getElementById("google_map")!, {
        zoom: 18,
        center: map_center || { lat: 0, lng: 0 },
        disableDefaultUI: true,
        mapId: "b7a7a363c50a7f5d",
      });

      let marker = new AdvancedMarkerElement({
        map,
        position: map.getCenter(),
      });

      map.addListener("click", (e: google.maps.MapMouseEvent) => {
        marker.map = null;

        marker = new AdvancedMarkerElement({
          map,
          position: e.latLng,
        });

        if (setLocalizacao && e.latLng) setLocalizacao(e.latLng.toJSON());
      });
    }); */

		return <div id="map" className={styles.map}></div>;
	}
}
