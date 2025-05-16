import styled from "@emotion/styled";

export const ButtonJira = styled.button`
  background: ${(props) => props.bg};
  border: ${(props) => props.border};
  color: ${(props) => props.color};
  width: 100%;
  border-radius: 40px;
  height: 50px;
  font-size: 1rem;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: all 0.5s;

  &:hover {
    background: ${(props) => props.bgHover};
  }
`;
