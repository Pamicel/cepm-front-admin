<script>
export default {
  props: {
    response: {
      type: [Number, String, Function, Array],
      required: false,
      default: null,
    },
    fieldName: {
      type: String,
      required: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    displayedResponse() {
      if (this.response instanceof Function) {
        return this.response()
      }
      return this.response
    },
    isList() {
      return this.displayedResponse instanceof Array
    },
  },
}
</script>

<template>
  <div>
    <div :class="$style.field">
      <label :class="$style.fieldName"
        >{{ fieldName }}
        <span v-if="required" :class="$style.required"
          >(obligatoire)</span
        ></label
      >
      <div :class="$style.response">
        <p v-if="!isList">{{ displayedResponse }}</p>
        <ul v-else>
          <li
            v-for="index of Object.keys(displayedResponse)"
            :key="`${index}${displayedResponse[index]}`"
            :class="$style.listItem"
            >{{ displayedResponse[index] }}</li
          >
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';

.field {
  display: flex;
  &:last-child {
    margin-bottom: 0;
  }
  .response {
    width: 50%;
    @media screen and (max-width: $size-breakpoint-small) {
      box-sizing: border-box;
      width: 100%;
    }

    .listItem::before {
      content: '- ';
    }
  }
  .fieldName {
    @extend %typography-small;

    width: 40%;
    margin-right: 1rem;
    font-weight: bold;
    text-align: right;
    .required {
      font-weight: normal;
    }
  }
  @media screen and (max-width: $size-breakpoint-small) {
    flex-direction: column;
    .fieldName {
      @extend %typography-small;

      width: 40%;
      margin-right: 0;
      text-align: left;
    }
  }
}
</style>
