import {  esObj  } from "@/frame/formMan.ts"
const { init, defForm, field, required, format, isArray } = esObj

init(function* (){ 
  
defForm('ObjItem1')
yield class ObjItem1 {
    @required()
    @field('name1')
    get name1() {
      return ''
    }
  
    @format('number')
    @required()
    @field('num1', {widgetType: 'number'})
    get num1() {
      return 0
    }
  
    @isArray({ min: 2 })
    @required()
    @field('爱好', {widgetType: 'multiCheckbox'})
    get hobby() {
      return []
    }
  }
      
defForm('some1')
yield class some1 {
    @required()
    @field('name1')
    get name1() {
      return ''
    }
  
    @format('number')
    @required()
    @field('num1', {widgetType: 'number'})
    get num1() {
      return 0
    }
  
    @isArray({ min: 2 })
    @required()
    @field('爱好', {widgetType: 'multiCheckbox'})
    get hobby() {
      return []
    }
  }
      
})
