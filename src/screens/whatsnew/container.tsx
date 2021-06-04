import React from "react";
import { Trans } from "react-i18next";

import { Container } from "@ui/container";

function WhatsnewRoute() {
  return (
    <Container
      style={{
        overflow: "auto",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Trans i18nKey={"whatsnew_20200707"}>
        <h1>Version 20200707</h1>
        <h2>UI Improvements</h2>
        <ul>
          <li>
            Computer Vision recognition (human and motion detection) is
            available in the UI.
          </li>
          <li>Trailer camera photo download / deep inspection.</li>
          <li>Events on the map are clustered if locations overlap.</li>
          <li>Sensor colouring reflect the warning / alarm status.</li>
          <li>Sensors blink if in alarming range when opening the trailer.</li>
          <li>Magic link for one-off authentication is implemented.</li>
          <li>
            "Shutdown in 2 min" and "Shutdown immediately" events are added.
          </li>
          <li>Trailer online detection is improved.</li>
          <li>Parking entering / leaving event detection improved.</li>
          <li>Header panel design improvements.</li>
        </ul>
        <h2>Technical improvements</h2>
        <ul>
          <li>Backend performance increased (bottleneck endpoints fixed).</li>
          <li>Device to Backend communication improvements.</li>
          <li>Monitoring window media download optimisation.</li>
        </ul>
      </Trans>
      <Trans i18nKey={"whatsnew_20200525"}>
        <h1>Version 20200525</h1>
        <h2>UI Improvements</h2>
        <ul>
          <li>
            SafeWay and Sternkraft logo watermarks each downloaded picture.
          </li>
          <li>Roaming status of the Trailer is displayed.</li>
          <li>
            Video and images for events (+1min, 0 and -1min) are downloaded
            automatically and available for offline viewing.
          </li>
          <li>
            Remaining traffic is displayed (local and roaming separately).
          </li>
          <li>Flexible role model.</li>
          <li>
            Toolbox for sensor alerts management (activation / deactivation per
            sensor).
          </li>
          <li>SMS and Email outbound notifications.</li>
          <li>GPS signal loss highlighted.</li>
          <li>Map events of GPS loss are displayed.</li>
          <li>Header panel design improvements.</li>
        </ul>
        <h2>Technical improvements</h2>
        <ul>
          <li>Automatic image downloading in home network every minute.</li>
          <li>
            Downloaded images are available for viewing even when the trailer is
            offline.
          </li>
          <li>
            Roaming status is detected, recorded in the DB and displayed in the
            interface.
          </li>
        </ul>
      </Trans>
      <Trans i18nKey={"whatsnew_20200412"}>
        <h1>Version 20200412</h1>
        <h2>UI Improvements</h2>
        <ul>
          <li>'Save video locally' functionality</li>
          <li>Eliminate excessive re-rendering of Monitoring window</li>
          <li>Camera image is recorded to the cloud every minute</li>
          <li>Thumbnail images are automatically displayed in the timeline</li>
          <li>'Data transfer' chart shows local traffic, updates daily</li>
          <li>'EU Data transfer' chart shows roaming traffic</li>
          <li>
            Click on event or route marker on map opens the Monitoring window
          </li>
          <li>Monitoring window displays camera enabled / disabled status</li>
          <li>Media files are named for a comfortable sorting</li>
          <li>Signal strength information is displayed in the panel</li>
          <li>Divided engine on/off and parking events</li>
        </ul>
        <h2>Technical improvements</h2>
        <ul>
          <li />
          <li>Video view & download stability improvements</li>
          <li>GPS filtering improvements to remove error deviations</li>
          <li>Device event logging improvements</li>
          <li>Device temperature (GPU and CPU) continuous monitoring</li>
          <li>
            Enterprise-level connection stability between device and server
          </li>
          <li>Detection of video download problems, information on them</li>
        </ul>
      </Trans>
      <Trans i18nKey={"whatsnew_20200221"}>
        <h1>Version 20200221</h1>
        <h2>UI Improvements</h2>
        <ul>
          <li>
            Trailer OFFLINE indicator is extended by an informative message
          </li>
          <li>
            Map contains markers with time and speed of a trailer - appear when
            hovering over
          </li>
          <li>
            If image or video from camera is unavailable, the eye icon turns to
            red with a message
          </li>
          <li>Parking events are displayed on the Map (Parking icon)</li>
          <ul>
            <li>Trailer is "parked" if engine is switched off.</li>
          </ul>
          <li>
            Engine ON/OFF events are available on Events Pane, Events Detail
            Pane and Map:
          </li>
          <li>
            Battery level indicator is calculated using physical discharge
            curve.
          </li>
          <li>14-days recording history is made available.</li>
          <li>Trailer reconnects regularly if looses network coverage.</li>
        </ul>
        <h2>Technical improvements</h2>
        <ul>
          <li>
            Invalid GPS points from the device are filtered to prevent route
            disturbance.
          </li>
          <li>
            Regular reconnect is implemented if trailer goes out of network
            temporarily.
          </li>
          <li>DB searches are optimised, cleanup procedure is implemented.</li>
        </ul>
      </Trans>
      <Trans i18nKey={"whatsnew_20200202"}>
        <h1>Version 20200202</h1>
        <h2>UI Improvements</h2>
        <ul>
          <li>
            "What's New" panel, that highlights all updates and fixes since last
            version
          </li>
          <li>
            Now last time when the Panel has got an update from the trailer is
            displayed ("Last login")
          </li>
          <li>
            Trailer engine ON/OFF indicator in Navigation Pane and in Details
            Pane.
          </li>
          <li>
            Trailer ONLINE/OFFLINE indicator in Navigation Pane and in Details
            Pane.
          </li>
          <ul>
            <li>
              Trailer is "online" if status update has come during last 30
              seconds.
            </li>
          </ul>
          <li>
            New Trailer events are available on Events Pane, Events Detail Pane
            and Map:
            <ul>
              <li>Truck disconnected from / connected to trailer</li>
              <li>Truck battery is low / is Ok</li>
              <li>System shutdown is approaching (5 min to shutdown)</li>
              <li>System shutdown is in progress</li>
            </ul>
          </li>
          <li>
            GPS route is made much smoother and fault-proof:
            <ul>
              <li>GPS points are recorded every 2 seconds</li>
              <li>GPS points are delivered to the server every 30 seconds</li>
              <li>
                If the Trailer goes offline, GPS points are stacked on the
                device and delivered when network connects.
              </li>
            </ul>
          </li>
          <li>
            Fixed screen glitches (login screen error message, language
            resources)
          </li>
          <li>h.264 parameters optimized for all cameras</li>
          <li>
            All cameras are set up to use GPS time to synchronize the internal
            clock.
          </li>
        </ul>
        <h2>Technical improvements</h2>
        <ul>
          <li>Web Panel performance is optimised in production.</li>
          <li>
            Resolved all code issues from RSpec, tests run without warnings.
          </li>
          <li>DB structure and Backend performance is optimised</li>
        </ul>
      </Trans>
    </Container>
  );
}

export default WhatsnewRoute;
