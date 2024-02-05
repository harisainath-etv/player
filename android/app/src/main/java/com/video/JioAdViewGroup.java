package com.etvwin.mobile;

import android.util.DisplayMetrics;
import android.util.TypedValue;
import android.widget.Toast;
import android.app.Activity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.view.ReactViewGroup;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.ReactContext;
import android.widget.ImageView;
import android.widget.TextView;
import android.os.Handler;
import android.util.Log;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Arrays;
import java.util.List;

import android.widget.FrameLayout;
import android.widget.RelativeLayout;

import java.util.Vector;

import android.text.TextUtils;

import com.jio.jioads.adinterfaces.JioAdListener;
import com.jio.jioads.adinterfaces.JioAdView;
import com.jio.jioads.adinterfaces.JioAdError;
import com.jio.jioads.adinterfaces.JioAds;
import com.jio.jioads.adinterfaces.JioAdsLoader;
import com.jio.jioads.adinterfaces.JioAdsLoaderListener;
import com.facebook.react.uimanager.MeasureSpecAssertions;
import com.jio.jioads.util.Constants;

import org.jetbrains.annotations.Nullable;
public class JioAdViewGroup extends ReactViewGroup implements LifecycleEventListener {

    protected JioAdView mJioAdView;
    private JioAdView.AD_TYPE mAdType;
    private String mAdspotKey;
    private RCTEventEmitter mEventEmitter;
    int pxW, mWidth;
    int pxH, mHeight;
    FrameLayout mIcon;
    RelativeLayout mMedia;
    FrameLayout audioAdContainer;
    ThemedReactContext context;

    public void setAdType(int adType) {
        Log.e("Test", "inside setAdType: " + adType);

        if (adType == 1)
            mAdType = JioAdView.AD_TYPE.DYNAMIC_DISPLAY;
        else if (adType == 2)
            mAdType = JioAdView.AD_TYPE.CONTENT_STREAM;
        else if (adType == 3)
            mAdType = JioAdView.AD_TYPE.CUSTOM_NATIVE;
        else if (adType == 4)
            mAdType = JioAdView.AD_TYPE.INSTREAM_VIDEO;
        else if (adType == 5)
            mAdType = JioAdView.AD_TYPE.INTERSTITIAL;
        else if (adType == 6)
            mAdType = JioAdView.AD_TYPE.INSTREAM_AUDIO;

        if (mAdType != null && !TextUtils.isEmpty(mAdspotKey))
            createAdViewIfCan();
    }

    public void setAdHeight(int adHeight) {
        Log.e("Test", "inside setAdHeight: " + adHeight);
        mHeight = adHeight;
    }

    public void setAdWidth(int adWidth) {
        Log.e("Test", "inside setAdWidth: " + adWidth);
        mWidth = adWidth;
    }

    public void setAdspotId(String adspotKey) {
        Log.e("Test", "inside setAdspotId: " + adspotKey);
        mAdspotKey = adspotKey;
        if (mAdType != null && !TextUtils.isEmpty(mAdspotKey))
            createAdViewIfCan();
        else
            loadVmap(mAdspotKey);
    }

    private int dp2px(int dp, DisplayMetrics dm) {
        return Math.round(TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, dp, dm));
    }


    private void createAdViewIfCan() {
        if (mJioAdView == null && mAdspotKey != null) {
            context = (ThemedReactContext) getContext();
            if (context.hasCurrentActivity()) {

                JioAds.Companion.getInstance().setEnvironment(JioAds.Environment.PROD);
                JioAds.Companion.getInstance().setLogLevel(JioAds.LogLevel.DEBUG);
                JioAds.Companion.getInstance().init(this.getContext());
                mJioAdView = new JioAdView(context.getCurrentActivity(), mAdspotKey, mAdType);

                setListenerToAdview(context.getCurrentActivity());
                DisplayMetrics dm = context.getResources().getDisplayMetrics();

                //                -----------For custom native uncomment below commneted section---------------------
                if (mAdType == JioAdView.AD_TYPE.CUSTOM_NATIVE) {
                    RelativeLayout container = (RelativeLayout) LayoutInflater.from(context).inflate(R.layout.jio_custom_native_layout, null);
//                    mIcon = (FrameLayout) container.findViewById(context.getResources().getIdentifier("jio_custom_icon", "id",
//                            context.getPackageName()));
                    mMedia = (RelativeLayout) container.findViewById(context.getResources().getIdentifier("jio_custom_media_view", "id",
                            context.getPackageName()));
//                    TextView descView = (TextView) container.findViewById(context.getResources().getIdentifier("jio_custom_desc", "id",
//                            context.getPackageName()));
//                    TextView titleView = (TextView) container.findViewById(context.getResources().getIdentifier("jio_tv_title", "id",
//                            context.getPackageName()));
//                    LayoutParams params = descView.getLayoutParams();
//                    LayoutParams params1 = mIcon.getLayoutParams();
//                    params.width = dm.widthPixels - params1.width;
//                    descView.setLayoutParams(params);
//                    titleView.setLayoutParams(params);
//                    mJioAdView.setCustomNativeAdContainer(R.layout.jio_custom_native_layout);
//                    mJioAdView.setCustomImageSize(992, 640);
                }
                //--------------------------------------------------------------------------------------------------------------
                if (mAdType == JioAdView.AD_TYPE.INSTREAM_AUDIO) {

                }
                if (mAdType == JioAdView.AD_TYPE.DYNAMIC_DISPLAY) {
                    ArrayList arrayList = new ArrayList<>();
                    arrayList.add(Constants.DynamicDisplaySize.SIZE_320x50);
                    mJioAdView.setDisplayAdSize(arrayList);
                }
                mJioAdView.cacheAd();
            }
        }
    }

    private void loadVmap(String vmapId) {
        JioAdsLoader jioAdsLoader = new JioAdsLoader(vmapId, (ThemedReactContext) getContext(), new JioAdsLoaderListener() {

            @Override
            public void onAdsLoadingError(@Nullable JioAdError jioAdError) {
                Log.e("Test", "onAdsLoadingError");
            }

            @Override
            public void onAdsUrlLoaded(String vmapUrl) {
                Log.e("Test", "onAdsUrlLoaded:: " + vmapUrl);
            }
        });

        try {
            int videolength = 30;
            jioAdsLoader.setContentVideoLength(videolength);
        } catch (Exception ex) {

        }

        ArrayList<Long> cuePoints = new ArrayList<>();
        String inputList = "10,20";
        List numbers = Arrays.asList(inputList.split(","));

        for (Object number : numbers) {
            try{
                cuePoints.add((long) Integer.parseInt(number.toString()));
            } catch (Exception ex) {

            }
        }

        jioAdsLoader.setContentVideoCuePoint(cuePoints);

        jioAdsLoader.getVmap();
    }

    public JioAdViewGroup(ThemedReactContext context) {
        super(context);
        context.addLifecycleEventListener(this);
        mEventEmitter = context.getJSModule(RCTEventEmitter.class);
    }


    @Override
    public void onHostResume() {
    }

    @Override
    public void onHostPause() {

    }

    @Override
    public void onHostDestroy() {
        if (mJioAdView != null) {
            mJioAdView.onDestroy();
        }
    }

    private void drawView() {
        DisplayMetrics dm = context.getResources().getDisplayMetrics();

        pxW = dp2px(mWidth, dm);  //Put width of required adView
        pxH = dp2px(mHeight, dm);  //Put height of required adView
        Log.e("Test", "pxW: " + pxW);
        Log.e("Test", "pxH: " + pxH);
        mJioAdView.measure(pxW, pxH);
        mJioAdView.layout(0, 0, pxW, pxH);
        removeAllViews();
        addView(mJioAdView, new FrameLayout.LayoutParams(pxW, pxH));

    }

    public void setListenerToAdview(final Activity activity) {

        mJioAdView.setAdListener(new JioAdListener() {

            @Override
            public void onAdMediaEnd(JioAdView jioAdView) {
                Log.d("Test", "onAdMediaEnd callback");
                Toast.makeText(context, "onAdMediaEnd", Toast.LENGTH_SHORT).show();

                //Notify in App.js
                /*WritableMap payload = Arguments.createMap();
                // Put data to map
                payload.putString("JioAdViewParam", jioAdView.getAdSpotId() + "_" + jioAdView.getAdType());
                // Emitting event from java code
                context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("onAdMediaEnd", payload);*/
            }

            @Override
            public void onAdClosed(JioAdView jioAdView, boolean isVideoCompleted, boolean isEligibleForReward) {
                Log.d("Test", "onAdClosed callback=> " + "isVideoCompleted: " + isVideoCompleted + " isEligibleForReward: " + isEligibleForReward);
                Toast.makeText(context, "onAdClosed", Toast.LENGTH_SHORT).show();
                 sendEvent("onAdClosed", isVideoCompleted);
            }

            @Override
            public void onAdFailedToLoad(JioAdView adview, JioAdError jioAdError) {
                Log.d("Test", "onAdFailedToLoad callback." + jioAdError.getErrorDescription());
                Toast.makeText(context, "" + jioAdError.getErrorDescription(), Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onAdPrepared(JioAdView adView) {
                Log.d("Test", "onAdPrepared callback");
                Toast.makeText(context, "onAdPrepared", Toast.LENGTH_SHORT).show();
                drawView();
                mJioAdView.loadAd();
            }

            @Override
            public void onAdChange(JioAdView jioAdView, int adNumber) {
                Log.d("Test", "onAdChange callback");
                Toast.makeText(context, "onAdChange", Toast.LENGTH_SHORT).show();
                drawView();
            }


            @Override
            public void onAdReceived(JioAdView jioAdView) {
                Log.d("Test", "onAdReceived callback");
                Toast.makeText(context, "onAdReceived", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onAdClicked(JioAdView adview) {
                Log.d("Test", "onAdClicked callback");
                Toast.makeText(context, "onAdClicked", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onAdRender(JioAdView adview) {
                Log.d("Test", "onAdRender callback");
                Toast.makeText(context, "onAdRender", Toast.LENGTH_SHORT).show();
                drawView();

//                if (mAdType == JioAdView.AD_TYPE.CUSTOM_NATIVE) {
//                    measureView(mIcon, 48, 48);
//                    measureView(mMedia, 320, 200);
//                } else {
//                    measureView(adview, 992, 640);
//                }
            }

            @Override
            public void onAdMediaStart(JioAdView adview) {
                Log.d("Test", "onAdMediaStart callback");
                Toast.makeText(context, "onAdMediaStart", Toast.LENGTH_SHORT).show();
                drawView();
            }

            @Override
            public void onAdRefresh(JioAdView adview) {
                Log.d("Test", "onAdRefresh callback");
                Toast.makeText(context, "onAdRefresh", Toast.LENGTH_SHORT).show();
                drawView();
//                if (mAdType == JioAdView.AD_TYPE.CUSTOM_NATIVE) {
//                    measureView(mIcon, 48, 48);
//                    measureView(mMedia, 320, 200);
//                }
            }

            @Override
            public void onAdMediaExpand(JioAdView adview) {
                Log.d("Test", "onAdMediaExpand callback");
                Toast.makeText(context, "onAdMediaExpand", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onAdMediaCollapse(JioAdView adview) {
                Log.d("Test", "onAdMediaCollapse callback");
                Toast.makeText(context, "onAdMediaCollapse", Toast.LENGTH_SHORT).show();
                drawView();
            }

            @Override
            public void onAdSkippable(JioAdView jioAdView) {
                Log.d("Test", "onAdSkippable callback");
                Toast.makeText(context, "onAdSkippable", Toast.LENGTH_SHORT).show();
            }
        });
    }
private void sendEvent(String eventName, boolean isVideoCompleted) {
    ReactContext reactContext = (ReactContext) getContext();
    reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, isVideoCompleted);
}
    private void measureView(ViewGroup viewGroup, int width/*in DP*/, int height/*in DP*/) {
        DisplayMetrics dm = context.getResources().getDisplayMetrics();
        View child = null;
        if (viewGroup != null) {
            child = viewGroup.getChildAt(0);
        }
        if (child != null) {
            child.measure(dp2px(width, dm), dp2px(height, dm));
            child.layout(0, 0, dp2px(width, dm), dp2px(height, dm));
        }
    }


}
