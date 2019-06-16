package pl.masi.beans;

import lombok.*;
import pl.masi.entities.Test;
import pl.masi.enums.QuestionType;

import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChoiceBean {
    private String id;
    private String content;
}
