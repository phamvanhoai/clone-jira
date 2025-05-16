import styled from "@emotion/styled";

export const FormTextField = styled.input`
  display: block;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  height: 50px;
  color: #fff;
  border: 1px solid transparent;
  border-radius: 40px;
  padding-left: 20px;
  padding-right: 20px;
  margin-bottom: 16px;
  background: rgba(255, 255, 255, 0.08);
  width: 100%;
  transition: all 0.5s;

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
    background-color: transparent;
  }

  &:hover,
  &:focus,
  &:focus-within,
  &:focus-visible {
    background: transparent;
    outline: none;
    -webkit-box-shadow: none;
    box-shadow: none;
    border-color: rgba(255, 255, 255, 0.4);
  }
`;
