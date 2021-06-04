import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { match as Match } from "react-router-dom";

import styled from "@ui/Theme";

import Chart from "./components/chart";
import SensorEvents from "./components/sensor-events";
import Settings from "./components/settings";
import Stats from "./components/stats";
import snakeToCamel from "@utils/snake-to-camel";
import { openModal } from "@ui/actions";
import {
  SensorTypes,
  SensorsState,
  SensorEvent,
  isSensorType,
} from "./reducer";
import { useTypedSelector } from "@store/index";
import { TrailerId } from "@screens/trailers/reducer";
import {
  fetchSensorEvents,
  fetchSensors,
  fetchSensorSettings,
  patchSensorSettings,
} from "./actions";
import { ModalComponentTypes } from "@ui/reducer";
import { useTranslation } from "react-i18next";
import { ToastType, useToast } from "@ui/Toast/Toast";

interface OwnProps {
  match: Match<{ id: TrailerId; sensorId: SensorTypes }>;
}

function DetailedSensor({ match }: OwnProps) {
  const sensors = useTypedSelector<SensorsState>((state) => state.sensors);
  const dispatch = useDispatch<(arg: any) => Promise<any>>();
  const toast = useToast();

  const { id, sensorId } = match.params;

  const { t } = useTranslation("sensors");

  const camelcased = snakeToCamel(sensorId);

  const sensorEntry = sensors.sensors[id];
  const sensorType = isSensorType(camelcased) ? camelcased : undefined;
  const sensor =
    sensorEntry && sensorType ? sensorEntry[sensorType] : undefined;
  const [sensorSettings, setSensorSettings] = useState(
    sensor && sensors.settings[sensor.id]
  );

  let events = new Array<SensorEvent>();

  const trailerSensors = sensors.order[id];

  if (trailerSensors !== undefined) {
    events = trailerSensors
      .map((id) => sensors.alarms[id])
      .filter((obj: any): obj is SensorEvent => Boolean(obj));
  }

  useEffect(() => {
    if (id) {
      dispatch(fetchSensors(id));
    }
  }, [dispatch, id, sensorType]);

  useEffect(() => {
    if (sensor) {
      dispatch(fetchSensorSettings(sensor.id, id));
      dispatch(fetchSensorEvents(id, sensor.id));
    }
  }, [dispatch, id, sensor]);

  useEffect(() => {
    if (sensor && !sensorSettings) {
      setSensorSettings(sensors.settings[sensor.id]);
    }
  }, [sensor, sensorSettings, sensors.settings]);

  return (
    <SensorDetails>
      <LeftColumn>
        <Chart
          sensor={sensor}
          sensors={sensors}
          id={id}
          settings={sensorSettings}
          fetchSensors={(id) => dispatch(fetchSensors(id))}
        />
        {sensor && <Stats sensor={sensor} />}
      </LeftColumn>
      <RightColumn>
        <SensorEvents sensorId={sensorId} events={events} />
        {sensorSettings && (
          <Settings
            settings={sensorSettings}
            updateSensorSettings={(settings) => {
              settings && setSensorSettings(settings);
            }}
            onCancelGoBackToTrailer={id}
            cancel={() => {
              if (sensor) {
                setSensorSettings(sensors.settings[sensor.id]);
              }
            }}
            save={() => {
              dispatch(
                openModal(ModalComponentTypes.alert, {
                  labels: {
                    description: t`confirm_save`,
                  },
                  onConfirm: (closeModal: () => void) => {
                    if (sensor) {
                      toast.add({
                        children: <span>{t('saving')}</span>,
                      });
                      dispatch(
                        patchSensorSettings(sensor.id, sensorSettings, id)
                      )
                        .then(() => {
                          toast.add({
                            type: ToastType.SUCCESS,
                            children: (
                              <span>{t('saved')}</span>
                            ),
                          });
                        })
                        .catch(() => {
                          toast.add({
                            type: ToastType.ERROR,
                            children: (
                              <span>{t('saving_error')}</span>
                            ),
                          });
                        });
                    }
                    closeModal();
                  },
                })
              );
            }}
          />
        )}
      </RightColumn>
    </SensorDetails>
  );
}

export default DetailedSensor;

const SensorDetails = styled.div`
  margin: 8px;
  display: flex;
  flex-direction: row;
  background-color: #ffffff;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.15);
`;

const LeftColumn = styled.div`
  padding: 15px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 39;
`;

const RightColumn = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 61;
`;
