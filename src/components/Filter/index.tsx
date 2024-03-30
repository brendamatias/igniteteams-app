import { TouchableOpacityProps } from "react-native";
import { FilterStyleProps, Container, Title } from "./styles";

type FilterProps = TouchableOpacityProps & FilterStyleProps & {
    title: string
}

export function Filter({ title, isActive = false, ...rest }: FilterProps) {
   return (
    <Container isActive={isActive} {...rest}>
        <Title>
            {title}
        </Title>
    </Container>
   )
}