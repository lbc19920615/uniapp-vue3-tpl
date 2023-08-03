<template>
  <template v-if="widgetType === 'number'">
    <uni-easyinput v-model="inputValue" @input="onChange" type="number" :placeholder="placeholder"  />
  </template>
  <template v-else-if="widgetType === 'multiCheckbox'">
    <uni-data-checkbox multiple @input="onChange" v-model="inputValue"  v-bind="widgetConfig" />
  </template>
  <template v-else-if="widgetType === 'radio'">
    <uni-data-checkbox @input="onChange" v-model="inputValue"  v-bind="widgetConfig" />
  </template>
  <template v-else-if="widgetType === 'native'">
    <input v-model="inputValue" @input="onNativeChange" type="number" :placeholder="placeholder"  />
  </template>
  <template v-else>
    <uni-easyinput v-model="inputValue" type="text" @input="onChange" :placeholder="placeholder" />
  </template>
</template>

<script lang="ts">
export default {
    name: 'DymInput',
    emits: ['change', 'input', 'update:modelValue', 'blur', 'focus'],
    props: {
        form: {
            type: String,
            default: ''
        },
        disabledMax: {
            type: Boolean,
            default: false
        },
        widgetType: {
            type: String,
            default: ''
        },
        disabledInput: {
            type: Boolean,
            default: true
        },
        modelValue: {
            type: [Number, String],
            default: ''
        },
        placeholder: {
            type: String,
            default: ''
        },
        widgetConfig: {
            type: Object,
            default() {
                return 
            }
        }
    },
    data() {
        return {
            inputValue: ''
        };
    },
    computed: {
        formObj() {
            let page = getCurrentPages().at(-1)
            return page?.$refs[this.form]
        }
    },
    watch: {
        value(val) {
            this.inputValue = val;
        },
        modelValue(val) {
            this.inputValue = val;
        }
    },
    methods: {
        setValue(name, value) {
            let form = this.formObj
            console.log('sssssssssssssss', name, value);

            // 设置表单某项对应得值来触发表单校验
            // 接受两个参数，第一个参数为表单域的 name ，第二个参数为表单域的值
            form.setValue(name, value)
        },
        onChange(v) {
            this.$emit('update:modelValue', v)
            this.$emit("change", v);
        },
        onNativeChange(e) {
            // console.log(e);
            let val = e.detail.value
            // this.setValue(val)
            this.onChange(val)
        }
    }
}
</script>