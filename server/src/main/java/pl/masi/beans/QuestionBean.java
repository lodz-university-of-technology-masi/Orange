package pl.masi.beans;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import pl.masi.entities.Test;
import pl.masi.enums.QuestionType;

import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionBean {
    private String name;
    private String content;
    private List<Test> tests;
    private QuestionType questionType;
}
