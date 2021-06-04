import React from "react";
import { useTranslation } from "react-i18next";

import { EyeOutlineIcon } from "@common/icons";
import styled from "@ui/Theme";

import { MonitoringCamera, CameraSetting } from "@features/monitoring/types";
import { MonitoringState } from "@features/monitoring/reducer";

export interface PreviewImageProps {
  src?: string;
  active?: boolean;
  shouldRenderDetails?: boolean;
  camera?: MonitoringCamera;
  setting?: CameraSetting;

  alert?: MonitoringState["error"];
}

function PreviewImage({
  src,
  shouldRenderDetails,
  camera,
  setting,
}: PreviewImageProps) {
  const { t } = useTranslation("monitoring");

  // const monitoring = useTypedSelector<MonitoringState>(state => state.monitoring);
  // const ui = useTypedSelector<UiState>(state => state.ui);
  // const alert = monitoring?.error
  // const dispatch = useDispatch();

  if (src) {
    return <Preview src={src} />;
  }

  return (
    <Thumbnail>
      {!setting?.installedAt && (
        <></>
        /* hidded uninstalled cameras, showing nothing <>
          <EyeOffOutlineIcon wrapperSize={30} iconSize={30} color={'gray'} backgroundColor={'transparent'} active={true} />
          { shouldRenderDetails && <ErrorInfo>{t`camera_not_installed`}</ErrorInfo> }
          { !shouldRenderDetails && <ErrorSmallInfo>{t`camera_not_installed`}</ErrorSmallInfo> }
        </> */
      )}
      {setting?.installedAt && (
        <>
          <EyeOutlineIcon
            wrapperSize={30}
            iconSize={30}
            color={"#4390e5"}
            backgroundColor={"transparent"}
            active={true}
          />
          {shouldRenderDetails ? (
            <Info>{t`download_photo`}</Info>
          ) : (
            <SmallInfo>{t`download_photo`}</SmallInfo>
          )}
        </>
        /*  { alert && (camera?.type == ui?.camera)
              ? <EyeOutlineIcon wrapperSize={30} iconSize={30} color={'#d75d30'} backgroundColor={'transparent'} active={false}
                  onClick = { () => {
                    dispatch(openModal(ModalComponentTypes.mediaWarning, { labels: { type: camera?.type } } ));
                  } }
                />
              : <EyeOutlineIcon wrapperSize={30} iconSize={30} color={'#4390e5'} backgroundColor={'transparent'} active={true} />
          }
          { alert && (camera?.type == ui?.camera)
              ? (shouldRenderDetails ? <ErrorInfo>{t`download_photo_na`}</ErrorInfo> : <ErrorSmallInfo>{t`download_photo_na`}</ErrorSmallInfo>)
              : (shouldRenderDetails ? <Info>{t`download_photo`}</Info> : <SmallInfo>{t`download_photo`}</SmallInfo>)
          }
        </> */
      )}
    </Thumbnail>
  );
}

export default PreviewImage;

const Preview = styled.div<PreviewImageProps>`
  background: url("${({ src }) => src}") center center no-repeat;
  background-size: cover;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
`;

const Thumbnail = styled.div`
  user-select: none;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const Info = styled.div`
  user-select: none;
  margin-top: 8px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: 1.6px;
  text-align: center;
  color: #4390e5;
  text-transform: uppercase;
`;

const SmallInfo = styled(Info)`
  user-select: none;
  margin-top: 0;
  font-size: 6px;
  letter-spacing: 1.3px;
`;
