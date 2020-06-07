<template>
  <div class="container">
    <styled-form class="login-form">
      <label>
        <span>Endpoint</span>
        <input type="text" v-model="endpoint" />
      </label>
      <label>
        <span>Access Key</span>
        <input type="text" v-model="accessKey" />
      </label>
      <label>
        <span>Secret Key</span>
        <input type="text" v-model="secretKey" />
      </label>
      <label>
        <span>Bucket</span>
        <input type="text" v-model="bucket" />
      </label>
      <label>
        <span>CloudFront Url</span>
        <input type="text" v-model="cloudFrontUrl" />
      </label>
      <button class="primary" :disabled="!isValid" @click="login">Login</button>
    </styled-form>
  </div>
</template>

<script>
import { StyledForm } from '@/components/lib/StyledForm';
import { isCredentialsValid } from '@/api/credentials-api';
import { getCredentials, setCredentials } from '@/services/storage-service';

export default {
  name: 'Login',
  components: { StyledForm },
  data() {
    return {
      endpoint: '',
      accessKey: '',
      secretKey: '',
      bucket: '',
      cloudFrontUrl: ''
    };
  },
  computed: {
    isValid() {
      return !!(
        this.endpoint.trim() &&
        this.accessKey.trim() &&
        this.secretKey.trim() &&
        this.bucket.trim()
      );
    }
  },
  methods: {
    async login() {
      if (this.isValid) {
        const credentials = {
          endpoint: this.endpoint,
          useSSL: this.useSSL, // add to form
          accessKey: this.accessKey,
          secretKey: this.secretKey,
          bucket: this.bucket,
          cloudFrontUrl: this.cloudFrontUrl
        };
        const isValid = await isCredentialsValid(credentials);
        if (isValid) {
          setCredentials(credentials);
          const { endpoint, useSSL, bucket, cloudFrontUrl } = credentials;
          this.$store.dispatch('context/initContext', { endpoint, useSSL, bucket, cloudFrontUrl });
          this.$router.replace({ name: 'groupList' });
        }
      }
    }
  },
  mounted() {
    const { endpoint, useSSL, accessKey, secretKey, bucket, cloudFrontUrl } = getCredentials();
    this.endpoint = endpoint || '';
    this.useSSL = useSSL || true;
    this.accessKey = accessKey || '';
    this.secretKey = secretKey || '';
    this.bucket = bucket || '';
    this.cloudFrontUrl = cloudFrontUrl || '';
  }
};
</script>

<style scoped>
.container {
  display: grid;
  height: 100vh;
  grid-template-rows: auto;
  grid-template-columns: auto;
  grid-template-areas: 'loginForm';
  justify-content: center;
  align-content: center;
}
.login-form {
  grid-area: loginForm;
  width: 100vw;
  max-width: 500px;
}
</style>
