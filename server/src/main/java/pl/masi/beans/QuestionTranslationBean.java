package pl.masi.beans;

import lombok.*;

import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionTranslationBean {
    private String content;
    private String questionName;
    private String languageName;
    private List<ChoiceBean> choices;
}
