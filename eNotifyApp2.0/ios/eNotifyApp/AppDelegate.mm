#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
#import <UserNotifications/UserNotifications.h>
#import <Firebase.h>  // Import Firebase

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"eNotifyApp";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  // Set up user notifications
  [UNUserNotificationCenter currentNotificationCenter].delegate = self;
  UNAuthorizationOptions authOptions = UNAuthorizationOptionAlert |
                                       UNAuthorizationOptionSound | 
                                       UNAuthorizationOptionBadge;
  [[UNUserNotificationCenter currentNotificationCenter] 
      requestAuthorizationWithOptions:authOptions 
      completionHandler:^(BOOL granted, NSError * _Nullable error) {
        // ...
      }];

  [application registerForRemoteNotifications];

  // Configure Firebase
  [FIRApp configure];

  // Set the FIRMessaging delegate
  [FIRMessaging messaging].delegate = self;

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self getBundleURL];
}

- (NSURL *)getBundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
