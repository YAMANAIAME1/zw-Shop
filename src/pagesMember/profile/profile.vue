<script setup lang="ts">
import { getMemberProfileAPI, putMemberProfileAPI } from '@/services/profile'
import { onLoad } from '@dcloudio/uni-app'
import type { ProfileDetail, Gender } from '@/types/member'
import { ref } from 'vue'
import { useMemberStore } from '@/stores'
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

const Profile = ref({} as ProfileDetail)
const getMemberProfile = async () => {
  const res = await getMemberProfileAPI()
  Profile.value = res.result
}

onLoad(() => {
  getMemberProfile()
})

// 用户头像更新
const memberStore = useMemberStore()
const upProfileAvatar = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      uni.uploadFile({
        url: '/member/profile/avatar',
        name: 'file',
        filePath: res.tempFilePaths[0],
        success: (res) => {
          // 判断是否上传成功
          if (res.statusCode === 200) {
            // 提取出字段
            const { avatar } = JSON.parse(res.data).result
            // 更新当前页面头像
            Profile.value!.avatar = avatar
            // 更新本地头像
            memberStore.profile!.avatar = avatar
            uni.showToast({ icon: 'success', title: '更新成功' })
          } else {
            uni.showToast({ icon: 'error', title: '更新失败' })
          }
        },
      })
    },
  })
}

// 用户性别事件
const onGenderChange: UniHelper.RadioGroupOnChange = (e) => {
  Profile.value.gender = e.detail.value as Gender
}

// 用户生日事件
const onChangeDate: UniHelper.DatePickerOnChange = (e) => {
  Profile.value.birthday = e.detail.value
}

// 用户城市事件
let fullLocationCode: [string, string, string] = ['', '', '']
const onChangeRegion: UniHelper.RegionPickerOnChange = (e) => {
  // 更新前端
  Profile.value.fullLocation = e.detail.value.join(' ')
  // 更新后端
  fullLocationCode = e.detail.code!
}

// 用户信息更新
const upDateProfile = async () => {
  const { nickname, gender, birthday, profession } = Profile.value
  const [provinceCode, cityCode, countyCode] = fullLocationCode
  await putMemberProfileAPI({
    nickname,
    gender,
    birthday,
    profession,
    provinceCode,
    cityCode,
    countyCode,
  })
  uni.showToast({ icon: 'success', title: '保存成功' })
  setTimeout(() => {
    uni.navigateBack()
  }, 300)
}
</script>

<template>
  <view class="viewport">
    <!-- 导航栏 -->
    <view class="navbar" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
      <navigator open-type="navigateBack" class="back icon-left" hover-class="none"></navigator>
      <view class="title">个人信息</view>
    </view>
    <!-- 头像 -->
    <view class="avatar" @tap="upProfileAvatar">
      <view class="avatar-content">
        <image class="image" :src="Profile?.avatar" mode="aspectFill" />
        <text class="text">点击修改头像</text>
      </view>
    </view>
    <!-- 表单 -->
    <view class="form">
      <!-- 表单内容 -->
      <view class="form-content">
        <view class="form-item">
          <text class="label">账号</text>
          <text class="account">{{ Profile?.account }}</text>
        </view>
        <view class="form-item">
          <text class="label">昵称</text>
          <input class="input" type="text" v-model="Profile!.nickname" placeholder="请填写昵称" />
        </view>
        <view class="form-item">
          <text class="label">性别</text>
          <radio-group @change="onGenderChange">
            <label class="radio">
              <radio value="男" color="#27ba9b" :checked="Profile?.gender == '男'" />
              男
            </label>
            <label class="radio">
              <radio value="女" color="#27ba9b" :checked="Profile?.gender == '女'" />
              女
            </label>
          </radio-group>
        </view>
        <view class="form-item">
          <text class="label">生日</text>
          <picker
            class="picker"
            mode="date"
            start="1900-01-01"
            :end="new Date()"
            @change="onChangeDate"
            :value="Profile?.birthday"
          >
            <view v-if="Profile?.birthday">{{ Profile?.birthday }}</view>
            <view class="placeholder" v-else>请选择日期</view>
          </picker>
        </view>
        <view class="form-item">
          <text class="label">城市</text>
          <picker
            @change="onChangeRegion"
            class="picker"
            mode="region"
            :value="Profile?.fullLocation?.split(' ')"
          >
            <view v-if="Profile?.fullLocation">{{ Profile?.fullLocation }}</view>
            <view class="placeholder" v-else>请选择城市</view>
          </picker>
        </view>
        <view class="form-item">
          <text class="label">职业</text>
          <input class="input" type="text" placeholder="请填写职业" v-model="Profile!.profession" />
        </view>
      </view>
      <!-- 提交按钮 -->
      <button class="form-button" @tap="upDateProfile">保 存</button>
    </view>
  </view>
</template>

<style lang="scss">
page {
  background-color: #f4f4f4;
}

.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-image: url(https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/order_bg.png);
  background-size: auto 420rpx;
  background-repeat: no-repeat;
}

// 导航栏
.navbar {
  position: relative;

  .title {
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    font-weight: 500;
    color: #fff;
  }

  .back {
    position: absolute;
    height: 40px;
    width: 40px;
    left: 0;
    font-size: 20px;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

// 头像
.avatar {
  text-align: center;
  width: 100%;
  height: 260rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .image {
    width: 160rpx;
    height: 160rpx;
    border-radius: 50%;
    background-color: #eee;
  }

  .text {
    display: block;
    padding-top: 20rpx;
    line-height: 1;
    font-size: 26rpx;
    color: #fff;
  }
}

// 表单
.form {
  background-color: #f4f4f4;

  &-content {
    margin: 20rpx 20rpx 0;
    padding: 0 20rpx;
    border-radius: 10rpx;
    background-color: #fff;
  }

  &-item {
    display: flex;
    height: 96rpx;
    line-height: 46rpx;
    padding: 25rpx 10rpx;
    background-color: #fff;
    font-size: 28rpx;
    border-bottom: 1rpx solid #ddd;

    &:last-child {
      border: none;
    }

    .label {
      width: 180rpx;
      color: #333;
    }

    .account {
      color: #666;
    }

    .input {
      flex: 1;
      display: block;
      height: 46rpx;
    }

    .radio {
      margin-right: 20rpx;
    }

    .picker {
      flex: 1;
    }
    .placeholder {
      color: #808080;
    }
  }

  &-button {
    height: 80rpx;
    text-align: center;
    line-height: 80rpx;
    margin: 30rpx 20rpx;
    color: #fff;
    border-radius: 80rpx;
    font-size: 30rpx;
    background-color: #27ba9b;
  }
}
</style>
