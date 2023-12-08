interface IUserInfo {
    username :string
    password :string
}

interface ILoginUserInfo {
    username :UserAccount,
    token :string,
    isAuthenticated :boolean
    isAdmin :boolean
}

enum UserAccount {
    Admin = "admin",
    Guest = "guest"
}

interface IResponse {
    code :number
    reason :string
    message :string
    metadata :any
}

interface ISystemInfo {
    total_client :number
    total_subscription :number
    name :string
    version :string
    engine :string
}

interface IClientSubscription {
    topic :string
    group :string
}

interface IClientBaseInfo {
    identifie :string
    address :string
    connect_time :number
}
interface IClientInfo extends IClientBaseInfo{
    subscription_info :IClientSubscription[]
}

interface ITopicInfo {
    topic_name :string
    group :IGroupInfo[]
}

interface IGroupInfo {
    group_name :string
    subscription :IClientBaseInfo[]
}

enum Theme {
    Dark = "dark",
    Light = "light"
}
const ThemeKey = "theme"

interface ISubscription {
    identifie :string
    topic :string
    group :string
}

interface ISetting {
    refresh_time :number
    dark_theme :boolean
}

export type { IUserInfo, ILoginUserInfo, IResponse, ISystemInfo, IClientInfo,IClientSubscription, ITopicInfo, IGroupInfo, IClientBaseInfo, ISubscription, ISetting}
export {Theme, ThemeKey, UserAccount}