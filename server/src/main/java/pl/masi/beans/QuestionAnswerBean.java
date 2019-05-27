package pl.masi.beans;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionAnswerBean {
    private String questionName;
    private String content;
}
