package pl.masi.beans.alternative;

import lombok.*;
import pl.masi.entities.Question;

import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TranslatedTestBean {
    private String testName;
    private String positionName;
    private String languageName;
    private List<TranslatedQuestionBean> translatedQuestions;
}
