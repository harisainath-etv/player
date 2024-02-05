package com.etvwin.mobile;

import android.view.View;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.bridge.ReactMethod;
import android.util.Log;
import androidx.annotation.Nullable;
import java.util.Map;

public class JioAdViewManager extends SimpleViewManager<JioAdViewGroup> {
    @Override
    public String getName() {
        return "RCTNativeView";
    }

    @ReactProp(name = "adType")
    public void setAdspotKey(JioAdViewGroup view, @Nullable int adType) {
        view.setAdType(adType);
    }

    @ReactProp(name = "adspotKey")
    public void setAdspotKey(JioAdViewGroup view, @Nullable String adspot) {
        view.setAdspotId(adspot);
    }

    @ReactProp(name = "adHeight")
    public void setHeight(JioAdViewGroup view, @Nullable int adHeight) {
        view.setAdHeight(adHeight);
    }

    @ReactProp(name = "adWidth")
    public void setWidth(JioAdViewGroup view, @Nullable int adWidth) {
        view.setAdWidth(adWidth);
    }

    @Override
    protected JioAdViewGroup createViewInstance(ThemedReactContext reactContext) {
        return new JioAdViewGroup(reactContext);
    }


}