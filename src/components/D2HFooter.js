import React from "react";

import "./D2HFooter.css";

export default function D2HFooter() {
	return (
		<div>
			<div id="footer-filler" />
			<div id="d2h-footer">
				<p>
					&copy;2021{" "}
					<a href="mailto:distance2home@gmail.com" style={{ color: "#ffc107" }}>
						Created by Edward Liu
					</a>
				</p>
			</div>
		</div>
	);
}
