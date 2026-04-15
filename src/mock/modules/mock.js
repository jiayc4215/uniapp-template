// #ifdef H5
import Mock from "better-mock"
const mockBrowser = Mock.mock
// #endif
// #ifdef MP-WEIXIN
import { mock as mockMP } from "better-mock/dist/mock.mp"
// #endif
import { isMp } from "@uni-helper/uni-env"

const mock = isMp ? mockMP : mockBrowser

export default mock
