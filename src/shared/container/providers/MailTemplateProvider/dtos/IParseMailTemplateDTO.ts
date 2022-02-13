interface IParseMailTemplateDTO {
  file: string;
  variables: {
    [key: string]: string | number;
  };
}

export { IParseMailTemplateDTO };
