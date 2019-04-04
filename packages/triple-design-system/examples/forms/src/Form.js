import React, { PureComponent } from 'react'
import { withFormik, Field } from 'formik'

import {
  Container,
  Input,
  Radio,
  Button,
  Checkbox,
} from '@titicaca/triple-design-system/src'

class Form extends PureComponent {
  componentDidMount() {
    this.props.validateForm()
  }
  render() {
    const {
      setFieldValue,
      values,
      handleSubmit,
      touched,
      errors,
      handleChange,
      isSubmitting,
    } = this.props

    const disableButton = isSubmitting || Object.keys(errors).length > 0

    return (
      <Container padding={{ top: 40, left: 30, right: 30 }}>
        <form onSubmit={handleSubmit}>
          <Container margin={{ bottom: 10 }}>
            <Field
              name="name"
              validate={(value) => !value && '필수 입력 값 입니다'}
              render={({ field: { name, onBlur } }) => (
                <Input
                  label="이름"
                  placeholder="이름을 입력해주세요"
                  name={name}
                  onBlur={onBlur}
                  value={values.name}
                  onChange={handleChange}
                  error={touched.name && errors.name}
                />
              )}
            />
          </Container>
          <Container margin={{ bottom: 10 }}>
            <Field
              name="gender"
              validate={(value) => !value && '필수 입력 값 입니다'}
              render={({ field: { name, onBlur } }) => (
                <Radio
                  gender
                  label="성별"
                  name={name}
                  onBlur={onBlur}
                  value={values.gender}
                  onClick={setFieldValue}
                  error={touched.gender && errors.gender}
                />
              )}
            />
          </Container>
          <Container>
            <Container>
              <Field
                name="passport.firstname"
                validate={(value) => !value && '필수 입력 값 입니다'}
                render={({ field: { name, onBlur } }) => (
                  <Input
                    label="영문성"
                    placeholder="HONG"
                    name={name}
                    onBlur={onBlur}
                    value={values.passport.firstname}
                    onChange={handleChange}
                    error={
                      touched.passport &&
                      touched.passport.firstname &&
                      errors.passport &&
                      errors.passport.firstname
                    }
                  />
                )}
              />
            </Container>
            <Container>
              <Field
                name="passport.lastname"
                validate={(value) => !value && '필수 입력 값 입니다'}
                render={({ field }) => (
                  <Input
                    label="영문이름"
                    placeholder="GILDONG"
                    value={values.passport.firstname}
                    onChange={handleChange}
                    error={
                      touched.passport &&
                      touched.passport.lastname &&
                      errors.passport &&
                      errors.passport.lastname
                    }
                    {...field}
                  />
                )}
              />
            </Container>
          </Container>
          <Container margin={{ bottom: 10 }}>
            <Field
              name="check"
              validate={(value) => !value && '필수 입력 값 입니다'}
              render={({ field: { name } }) => (
                <Checkbox
                  confirm
                  name={name}
                  placeholder="예약자와 투숙자가 다릅니다"
                  value={values.check}
                  onClick={setFieldValue}
                />
              )}
            />
          </Container>
          <Container margin={{ bottom: 10 }}>
            <Field
              name="item"
              validate={(value) => !value && '필수 입력 값 입니다'}
              render={({ field: { name } }) => (
                <>
                  {['item1', 'item2', 'item3'].map((item, idx) => (
                    <Radio
                      name={name}
                      value={item}
                      selected={values.item === item}
                      onSelect={setFieldValue}
                      key={idx}
                    />
                  ))}
                </>
              )}
            />
          </Container>
          <Button
            fluid
            borderRadius={4}
            color="blue"
            margin={{ bottom: 140 }}
            disabled={disableButton}
            onClick={!disableButton ? handleSubmit : null}
          >
            예약하기
          </Button>
        </form>
      </Container>
    )
  }
}

export default withFormik({
  mapPropsToValues: ({ initialValues }) => initialValues,
  validateOnChange: true,
  enableReinitialize: true,
  handleSubmit: async (
    values,
    { props: { onSubmit }, setErrors, setSubmitting },
  ) => {
    try {
      await onSubmit(values)

      return values
    } catch (e) {
      setErrors({ general: e.message })
    } finally {
      setSubmitting(false)
    }
  },
})(Form)
