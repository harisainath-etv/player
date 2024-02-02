// JioAdView.js
import React from 'react';
import { requireNativeComponent, View } from 'react-native';
import PropTypes from 'prop-types';

const RCTNativeView = requireNativeComponent('RCTNativeView', JioAdView);

const propTypes = {
    adType: PropTypes.number,
    adspotKey: PropTypes.string,
    adWidth: PropTypes.number,
    adHeight: PropTypes.number,
    ...View.propTypes,
};

const JioAdView = ({ adType, adspotKey, adWidth, adHeight}) => (
    <RCTNativeView
        style={{ width: adWidth, height: adHeight}}
        adType={adType}
        adspotKey={adspotKey}
        adWidth={adWidth}
        adHeight={adHeight}
    />
);

JioAdView.propTypes = propTypes;

export default JioAdView;
